from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Index
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./mgnrega.db")

engine = create_async_engine(DATABASE_URL, echo=True)
async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()


class District(Base):
    __tablename__ = "districts"
    
    id = Column(Integer, primary_key=True, index=True)
    state_code = Column(String, nullable=False, index=True)
    state_name = Column(String, nullable=False)
    district_code = Column(String, nullable=False, unique=True, index=True)
    district_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PerformanceData(Base):
    __tablename__ = "performance_data"
    
    id = Column(Integer, primary_key=True, index=True)
    district_code = Column(String, nullable=False, index=True)
    district_name = Column(String, nullable=False)
    month = Column(String, nullable=False)  # Format: YYYY-MM
    year = Column(Integer, nullable=False, index=True)
    
    # Key metrics
    total_households_issued_jobcards = Column(Float, default=0)
    households_completed_100days = Column(Float, default=0)
    total_works_takenup = Column(Float, default=0)
    total_works_completed = Column(Float, default=0)
    total_expenditure = Column(Float, default=0)  # In Lakhs
    person_days_generated = Column(Float, default=0)
    
    # Additional metrics
    avg_days_per_household = Column(Float, default=0)
    work_completion_rate = Column(Float, default=0)  # Percentage
    sc_persondays = Column(Float, default=0)
    st_persondays = Column(Float, default=0)
    women_persondays = Column(Float, default=0)
    
    # Raw data for future use
    raw_data = Column(JSON)
    
    fetched_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_district_month', 'district_code', 'month'),
    )


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_session():
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()

