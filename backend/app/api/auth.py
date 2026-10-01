from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.models import User, Farmer, Collector, Manufacturer
from app.schemas.schemas import UserRegister, UserLogin, Token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    role_clean = user_in.role.lower().strip()
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=role_clean,
        wallet_address=user_in.wallet_address
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Automatically create associated role profile
    if role_clean == "farmer":
        farmer = Farmer(
            user_id=new_user.id,
            farm_name=f"{new_user.full_name}'s Herb Farm",
            farm_location="Wayanad, Kerala",
            state="Kerala",
            gps_coordinates="11.6854° N, 76.1320° E",
            land_area_acres=4.5,
            ayush_reg_id=f"AYUSH-FARM-{new_user.id:04d}"
        )
        db.add(farmer)
    elif role_clean == "collector":
        collector = Collector(
            user_id=new_user.id,
            forest_region="Western Ghats Reserved Forest",
            state="Karnataka",
            permit_number=f"FOREST-PERMIT-2026-{new_user.id:03d}",
            authority_issued="State Forest Department",
            valid_until="2026-12-31"
        )
        db.add(collector)
    elif role_clean == "manufacturer":
        mfr = Manufacturer(
            user_id=new_user.id,
            company_name=f"{new_user.full_name} Ayurvedic Botanicals",
            license_no=f"AYUSH-MFG-LIC-{new_user.id:04d}",
            facility_address="Haridwar Industrial Area, Uttarakhand",
            ayush_approval_no=f"AYUSH-APP-{new_user.id:04d}"
        )
        db.add(mfr)

    db.commit()

    token = create_access_token(
        subject=new_user.id,
        role=new_user.role
    )

    user_info = {
        "id": new_user.id,
        "email": new_user.email,
        "full_name": new_user.full_name,
        "role": new_user.role,
        "wallet_address": new_user.wallet_address
    }

    return {"access_token": token, "token_type": "bearer", "user": user_info}

@router.post("/login", response_model=Token)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(
        subject=user.id,
        role=user.role
    )

    user_info = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "wallet_address": user.wallet_address
    }

    return {"access_token": token, "token_type": "bearer", "user": user_info}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns current authenticated user details from JWT token.
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "wallet_address": current_user.wallet_address,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at
    }
