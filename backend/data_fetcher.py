import httpx
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging
from sqlalchemy import select, and_
from database import async_session_maker, District, PerformanceData
import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_KEY = os.getenv("API_KEY", "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b")
BASE_URL = "https://api.data.gov.in/resource/c4b4c5d6-2b5f-4b5e-8f5a-9c3d2e1f0a1b"


class DataFetcher:
    def __init__(self):
        self.api_key = API_KEY
        self.timeout = httpx.Timeout(30.0)
        
        # Uttar Pradesh districts
        self.up_districts = [
            {"code": "0901", "name": "Agra"},
            {"code": "0902", "name": "Aligarh"},
            {"code": "0903", "name": "Allahabad"},
            {"code": "0904", "name": "Ambedkar Nagar"},
            {"code": "0905", "name": "Amethi"},
            {"code": "0906", "name": "Amroha"},
            {"code": "0907", "name": "Auraiya"},
            {"code": "0908", "name": "Azamgarh"},
            {"code": "0909", "name": "Baghpat"},
            {"code": "0910", "name": "Bahraich"},
            {"code": "0911", "name": "Ballia"},
            {"code": "0912", "name": "Balrampur"},
            {"code": "0913", "name": "Banda"},
            {"code": "0914", "name": "Barabanki"},
            {"code": "0915", "name": "Bareilly"},
            {"code": "0916", "name": "Basti"},
            {"code": "0917", "name": "Bijnor"},
            {"code": "0918", "name": "Budaun"},
            {"code": "0919", "name": "Bulandshahr"},
            {"code": "0920", "name": "Chandauli"},
            {"code": "0921", "name": "Chitrakoot"},
            {"code": "0922", "name": "Deoria"},
            {"code": "0923", "name": "Etah"},
            {"code": "0924", "name": "Etawah"},
            {"code": "0925", "name": "Ayodhya"},
            {"code": "0926", "name": "Farrukhabad"},
            {"code": "0927", "name": "Fatehpur"},
            {"code": "0928", "name": "Firozabad"},
            {"code": "0929", "name": "Gautam Buddha Nagar"},
            {"code": "0930", "name": "Ghaziabad"},
            {"code": "0931", "name": "Ghazipur"},
            {"code": "0932", "name": "Gonda"},
            {"code": "0933", "name": "Gorakhpur"},
            {"code": "0934", "name": "Hamirpur"},
            {"code": "0935", "name": "Hapur"},
            {"code": "0936", "name": "Hardoi"},
            {"code": "0937", "name": "Hathras"},
            {"code": "0938", "name": "Jalaun"},
            {"code": "0939", "name": "Jaunpur"},
            {"code": "0940", "name": "Jhansi"},
            {"code": "0941", "name": "Kannauj"},
            {"code": "0942", "name": "Kanpur Dehat"},
            {"code": "0943", "name": "Kanpur Nagar"},
            {"code": "0944", "name": "Kasganj"},
            {"code": "0945", "name": "Kaushambi"},
            {"code": "0946", "name": "Kushinagar"},
            {"code": "0947", "name": "Lakhimpur Kheri"},
            {"code": "0948", "name": "Lalitpur"},
            {"code": "0949", "name": "Lucknow"},
            {"code": "0950", "name": "Maharajganj"},
            {"code": "0951", "name": "Mahoba"},
            {"code": "0952", "name": "Mainpuri"},
            {"code": "0953", "name": "Mathura"},
            {"code": "0954", "name": "Mau"},
            {"code": "0955", "name": "Meerut"},
            {"code": "0956", "name": "Mirzapur"},
            {"code": "0957", "name": "Moradabad"},
            {"code": "0958", "name": "Muzaffarnagar"},
            {"code": "0959", "name": "Pilibhit"},
            {"code": "0960", "name": "Pratapgarh"},
            {"code": "0961", "name": "Prayagraj"},
            {"code": "0962", "name": "Raebareli"},
            {"code": "0963", "name": "Rampur"},
            {"code": "0964", "name": "Saharanpur"},
            {"code": "0965", "name": "Sambhal"},
            {"code": "0966", "name": "Sant Kabir Nagar"},
            {"code": "0967", "name": "Shahjahanpur"},
            {"code": "0968", "name": "Shamli"},
            {"code": "0969", "name": "Shravasti"},
            {"code": "0970", "name": "Siddharthnagar"},
            {"code": "0971", "name": "Sitapur"},
            {"code": "0972", "name": "Sonbhadra"},
            {"code": "0973", "name": "Sultanpur"},
            {"code": "0974", "name": "Unnao"},
            {"code": "0975", "name": "Varanasi"},
        ]
    
    async def initialize_districts(self):
        """Initialize districts in database"""
        async with async_session_maker() as session:
            for district in self.up_districts:
                stmt = select(District).where(District.district_code == district["code"])
                result = await session.execute(stmt)
                existing = result.scalar_one_or_none()
                
                if not existing:
                    db_district = District(
                        state_code="09",
                        state_name="Uttar Pradesh",
                        district_code=district["code"],
                        district_name=district["name"]
                    )
                    session.add(db_district)
            
            await session.commit()
            logger.info(f"Initialized {len(self.up_districts)} districts")
    
    async def fetch_district_data(self, district_code: str, month: str) -> Optional[Dict]:
        """
        Fetch data from data.gov.in API or generate mock data
        Since the actual API might not be available, we'll generate realistic mock data
        """
        try:
            # In production, you would use the actual API
            # For now, generate mock data
            return await self._generate_mock_data(district_code, month)
        except Exception as e:
            logger.error(f"Error fetching data for {district_code} - {month}: {e}")
            return None
    
    async def _generate_mock_data(self, district_code: str, month: str) -> Dict:
        """Generate realistic mock data for demonstration"""
        import random
        
        # Find district name
        district_name = next((d["name"] for d in self.up_districts if d["code"] == district_code), "Unknown")
        
        # Parse month
        year, month_num = map(int, month.split("-"))
        
        # Generate realistic data with some variation
        base_households = random.randint(50000, 200000)
        completion_rate = random.uniform(0.05, 0.15)
        work_completion = random.uniform(0.60, 0.95)
        
        data = {
            "district_code": district_code,
            "district_name": district_name,
            "month": month,
            "year": year,
            "total_households_issued_jobcards": base_households,
            "households_completed_100days": int(base_households * completion_rate),
            "total_works_takenup": random.randint(500, 2000),
            "total_works_completed": 0,
            "total_expenditure": random.uniform(1000, 5000),  # Lakhs
            "person_days_generated": random.randint(500000, 2000000),
            "avg_days_per_household": random.uniform(30, 50),
            "work_completion_rate": work_completion * 100,
            "sc_persondays": random.randint(100000, 500000),
            "st_persondays": random.randint(50000, 200000),
            "women_persondays": random.randint(250000, 1000000),
        }
        
        data["total_works_completed"] = int(data["total_works_takenup"] * work_completion)
        
        return data
    
    async def sync_district_data(self, district_code: str, months: List[str]):
        """Sync data for a district for specified months"""
        async with async_session_maker() as session:
            for month in months:
                # Check if data already exists
                stmt = select(PerformanceData).where(
                    and_(
                        PerformanceData.district_code == district_code,
                        PerformanceData.month == month
                    )
                )
                result = await session.execute(stmt)
                existing = result.scalar_one_or_none()
                
                # Only fetch if data is old or doesn't exist
                should_fetch = False
                if not existing:
                    should_fetch = True
                elif (datetime.utcnow() - existing.fetched_at) > timedelta(hours=24):
                    should_fetch = True
                
                if should_fetch:
                    data = await self.fetch_district_data(district_code, month)
                    
                    if data:
                        if existing:
                            # Update existing
                            for key, value in data.items():
                                setattr(existing, key, value)
                            existing.fetched_at = datetime.utcnow()
                            existing.updated_at = datetime.utcnow()
                        else:
                            # Create new
                            perf_data = PerformanceData(**data, raw_data=data)
                            session.add(perf_data)
                        
                        await session.commit()
                        logger.info(f"Synced data for {district_code} - {month}")
                
                # Rate limiting - be nice to the API
                await asyncio.sleep(0.5)
    
    async def sync_all_districts(self, months: List[str]):
        """Sync data for all districts"""
        for district in self.up_districts:
            try:
                await self.sync_district_data(district["code"], months)
            except Exception as e:
                logger.error(f"Error syncing district {district['code']}: {e}")
                continue


def get_last_n_months(n: int = 12) -> List[str]:
    """Get list of last N months in YYYY-MM format"""
    months = []
    current = datetime.now()
    
    for i in range(n):
        date = current - timedelta(days=30 * i)
        months.append(date.strftime("%Y-%m"))
    
    return months

