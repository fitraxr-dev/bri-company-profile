"""
Stock routes.
Handles stock data retrieval.
"""
from fastapi import APIRouter, HTTPException, status
from app.services.stock_service import stock_service

router = APIRouter(prefix="/api/stock", tags=["Stock"])


@router.get("/bbri", response_model=dict)
async def get_bbri_stock():
    """
    Get BBRI stock data from BRI website.
    
    Returns current stock price, change, volume, and other market data.
    """
    try:
        stock_data = await stock_service.get_stock_data()
        
        if not stock_data.get("success"):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=stock_data
            )
        
        return stock_data
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": "Gagal mengambil data saham",
                "message": str(e)
            }
        )
