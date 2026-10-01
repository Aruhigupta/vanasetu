from typing import Generator, List, Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Validates JWT access token from Authorization header.
    Returns the authenticated User model.
    Raises HTTP 401 on invalid/missing token.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token subject",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate token or token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Authenticated user no longer exists"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is inactive"
        )

    return user

def require_roles(*allowed_roles: str) -> Callable:
    """
    Enforces Role-Based Access Control (RBAC).
    Usage: Depends(require_roles("farmer", "admin"))
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        user_role = current_user.role.lower()
        allowed = [r.lower() for r in allowed_roles]
        if "admin" in allowed:
            # Admin role always has global override
            pass
        if user_role not in allowed and "admin" not in user_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: User role '{current_user.role}' is not authorized for this operation. Required: {', '.join(allowed_roles)}"
            )
        return current_user

    return role_checker
