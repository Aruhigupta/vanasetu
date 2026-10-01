from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from app.api.deps import get_current_user
from app.models.models import User
from app.services.ipfs_service import IPFSService

router = APIRouter(prefix="/files", tags=["File Uploads & IPFS Storage"])

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "pdf"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB limit

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Accepts multipart file upload (jpg, jpeg, png, webp, pdf), validates size & extension,
    pins file to IPFS via Pinata, and returns actual CID and Gateway URL.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing in uploaded file")

    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file extension '{ext}'. Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds 10MB limit (Uploaded size: {round(len(content)/(1024*1024), 2)}MB)"
        )

    # Pin to IPFS
    result = IPFSService.upload_file(content, file.filename)
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "cid": result["cid"],
        "ipfs_hash": result["ipfs_hash"],
        "gateway_url": result["gateway_url"],
        "uploaded_by": current_user.email
    }
