FROM python:3.9-slim-buster

WORKDIR /app

# Zaruriy paketlarni o'rnatish
RUN pip install Django djangorestframework djangorestframework_simplejwt django-cors-headers

COPY . .

# Migratsiyalarni bajarish
RUN python manage.py makemigrations
RUN python manage.py migrate

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

EXPOSE 8000