from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func, desc
from typing import List, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager

from database import get_session, init_db, District, PerformanceData
from data_fetcher import DataFetcher, get_last_n_months
from pydantic import BaseModel

load_dotenv()


class DistrictResponse(BaseModel):
    id: int
    state_name: str
    district_code: str
    district_name: str
    
    class Config:
        from_attributes = True


class PerformanceResponse(BaseModel):
    id: int
    district_code: str
    district_name: str
    month: str
    year: int
    total_households_issued_jobcards: float
    households_completed_100days: float
    total_works_takenup: float
    total_works_completed: float
    total_expenditure: float
    person_days_generated: float
    avg_days_per_household: float
    work_completion_rate: float
    sc_persondays: float
    st_persondays: float
    women_persondays: float
    fetched_at: datetime
    
    class Config:
        from_attributes = True


class DistrictSummary(BaseModel):
    district_code: str
    district_name: str
    latest_month: str
    total_person_days: float
    total_expenditure: float
    avg_work_completion_rate: float
    total_households: float


data_fetcher = DataFetcher()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    await data_fetcher.initialize_districts()
    
    # Initial data sync for recent months
    months = get_last_n_months(24)  # Last 2 years
    # Sync a few districts on startup (in production, use background task)
    await data_fetcher.sync_district_data("0949", months[:6])  # Lucknow
    await data_fetcher.sync_district_data("0975", months[:6])  # Varanasi
    await data_fetcher.sync_district_data("0901", months[:6])  # Agra
    
    yield
    
    # Shutdown
    pass


app = FastAPI(
    title="MGNREGA District Performance API",
    description="API for accessing MGNREGA district performance data",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "MGNREGA District Performance API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/districts", response_model=List[DistrictResponse])
async def get_districts(session: AsyncSession = Depends(get_session)):
    """Get all districts"""
    stmt = select(District).order_by(District.district_name)
    result = await session.execute(stmt)
    districts = result.scalars().all()
    return districts


@app.get("/api/districts/{district_code}", response_model=DistrictResponse)
async def get_district(district_code: str, session: AsyncSession = Depends(get_session)):
    """Get specific district"""
    stmt = select(District).where(District.district_code == district_code)
    result = await session.execute(stmt)
    district = result.scalar_one_or_none()
    
    if not district:
        raise HTTPException(status_code=404, detail="District not found")
    
    return district


@app.get("/api/districts/{district_code}/performance", response_model=List[PerformanceResponse])
async def get_district_performance(
    district_code: str,
    months: Optional[int] = Query(12, description="Number of months to retrieve"),
    session: AsyncSession = Depends(get_session)
):
    """Get performance data for a district"""
    # First check if we have data, if not trigger sync
    stmt = select(PerformanceData).where(
        PerformanceData.district_code == district_code
    ).order_by(desc(PerformanceData.month)).limit(months)
    
    result = await session.execute(stmt)
    data = result.scalars().all()
    
    # If we have less data than requested, trigger background sync
    if len(data) < months:
        # Trigger async sync (in production, use background tasks)
        import asyncio
        asyncio.create_task(
            data_fetcher.sync_district_data(district_code, get_last_n_months(months))
        )
    
    return data


@app.get("/api/districts/{district_code}/latest", response_model=PerformanceResponse)
async def get_latest_performance(
    district_code: str,
    session: AsyncSession = Depends(get_session)
):
    """Get latest performance data for a district"""
    stmt = select(PerformanceData).where(
        PerformanceData.district_code == district_code
    ).order_by(desc(PerformanceData.month)).limit(1)
    
    result = await session.execute(stmt)
    data = result.scalar_one_or_none()
    
    if not data:
        # Trigger sync
        import asyncio
        asyncio.create_task(
            data_fetcher.sync_district_data(district_code, get_last_n_months(3))
        )
        raise HTTPException(status_code=404, detail="No data available yet. Please try again in a moment.")
    
    return data


@app.get("/api/performance/summary", response_model=List[DistrictSummary])
async def get_performance_summary(session: AsyncSession = Depends(get_session)):
    """Get performance summary for all districts"""
    # Get latest data for each district
    subquery = (
        select(
            PerformanceData.district_code,
            func.max(PerformanceData.month).label("latest_month")
        )
        .group_by(PerformanceData.district_code)
        .subquery()
    )
    
    stmt = (
        select(PerformanceData)
        .join(
            subquery,
            and_(
                PerformanceData.district_code == subquery.c.district_code,
                PerformanceData.month == subquery.c.latest_month
            )
        )
        .order_by(PerformanceData.district_name)
    )
    
    result = await session.execute(stmt)
    data = result.scalars().all()
    
    summaries = []
    for d in data:
        summaries.append(DistrictSummary(
            district_code=d.district_code,
            district_name=d.district_name,
            latest_month=d.month,
            total_person_days=d.person_days_generated,
            total_expenditure=d.total_expenditure,
            avg_work_completion_rate=d.work_completion_rate,
            total_households=d.total_households_issued_jobcards
        ))
    
    return summaries


@app.post("/api/sync/{district_code}")
async def trigger_sync(
    district_code: str,
    months: int = Query(12, description="Number of months to sync")
):
    """Manually trigger data sync for a district"""
    import asyncio
    
    asyncio.create_task(
        data_fetcher.sync_district_data(district_code, get_last_n_months(months))
    )
    
    return {"message": f"Sync triggered for district {district_code}"}


@app.get("/api/compare")
async def compare_districts(
    district_codes: str = Query(..., description="Comma-separated district codes"),
    months: int = Query(6, description="Number of months to compare"),
    session: AsyncSession = Depends(get_session)
):
    """Compare multiple districts"""
    codes = [code.strip() for code in district_codes.split(",")]
    
    result_data = {}
    
    for code in codes:
        stmt = select(PerformanceData).where(
            PerformanceData.district_code == code
        ).order_by(desc(PerformanceData.month)).limit(months)
        
        result = await session.execute(stmt)
        data = result.scalars().all()
        result_data[code] = [PerformanceResponse.from_orm(d) for d in data]
    
    return result_data


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

