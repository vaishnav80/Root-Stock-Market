# Generated by Django 5.1.4 on 2025-01-05 11:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lessons', '0002_lesson_content'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lesson_content',
            name='heading_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='lessons.lesson'),
        ),
    ]
