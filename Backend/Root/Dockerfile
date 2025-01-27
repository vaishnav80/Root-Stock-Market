FROM python:3.10

WORKDIR /app

COPY . /app

# Install dependencies
RUN pip install -r requirements.txt

# Copy .env file
COPY .env /app/

# Expose the port
EXPOSE 8000

# Run Daphne for ASGI
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "Root.asgi:application"]
