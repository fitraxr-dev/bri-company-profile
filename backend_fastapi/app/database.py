"""
Database connection module.
Handles MongoDB connection using Motor (async driver).
"""
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Global database client and database instances
client: AsyncIOMotorClient = None
database = None


async def connect_to_mongo():
    """Connect to MongoDB database."""
    global client, database
    try:
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            server_api=ServerApi('1') if 'mongodb+srv' in settings.MONGODB_URI else None
        )
        # Get database name from URI or use default
        db_name = settings.MONGODB_URI.split('/')[-1].split('?')[0] or 'brimo_db'
        database = client[db_name]
        
        # Verify connection
        await client.admin.command('ping')
        logger.info(f"✅ MongoDB Connected: {settings.MONGODB_URI}")
    except Exception as e:
        logger.error(f"❌ Error connecting to MongoDB: {e}")
        raise


async def close_mongo_connection():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed")


def get_database():
    """Get database instance."""
    return database
