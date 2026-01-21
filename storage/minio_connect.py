from minio import Minio
from dotenv import load_dotenv
from minio.error import S3Error
import os

def connect_minio():
    load_dotenv()

    port = os.getenv('MINIO_PORT')
    access_key = os.getenv('MINIO_ROOT_USER')
    secret_key = os.getenv('MINIO_ROOT_PASSWORD')
    client = Minio(
        endpoint=f'127.0.0.1:{port}',
        access_key=access_key,
        secret_key=secret_key,
        secure=False,
    )
    
    return client


def upload_picture(source_file='../test.png',destination_file='test.png'):
    
    client = connect_minio()

    bucket_name = "user-images"
    
    # Make the bucket if it doesn't exist.
    found = client.bucket_exists(bucket_name=bucket_name)
    if not found:
        client.make_bucket(bucket_name=bucket_name)
        print("Created bucket", bucket_name)
    else:
        print("Bucket", bucket_name, "already exists")

    client.put_object(
        bucket_name=bucket_name,
        object_name=destination_file,
        data=source_file,
        length=-1,
        part_size=10*1024*1024
    )
    print(
        "successfully uploaded as object",
        destination_file, "to bucket", bucket_name,
    )
    

if __name__ == "__main__":
    try:
        with open('../test.png', 'rb') as image_file:
            upload_picture(source_file=image_file)
    except S3Error as exc:
        print("error occurred.", exc)