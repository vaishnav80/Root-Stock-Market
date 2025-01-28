FROM python:3.10

WORKDIR /app

COPY . /app

# Install dependencies
COPY ./Backend/Root/requirements.txt .
RUN pip install -r requirements.txt



# Expose the port
EXPOSE 8000

# Run Daphne for ASGI
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "Root.asgi:application"]
