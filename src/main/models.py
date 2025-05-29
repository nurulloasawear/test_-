from django.db import models

class Item(models.Model):
    name = models.CharField(max_length=255, verbose_name="Nomi")
    description = models.TextField(blank=True, null=True, verbose_name="Tavsifi")
    # Boshqa kerakli maydonlarni qo'shishingiz mumkin

    def __str__(self):
        return self.name

class Statistic(models.Model):
    title = models.CharField(max_length=255, verbose_name="Sarlavha")
    value = models.IntegerField(default=0, verbose_name="Qiymat")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Vaqti")
    # Boshqa kerakli maydonlarni qo'shishingiz mumkin

    def __str__(self):
        return self.title