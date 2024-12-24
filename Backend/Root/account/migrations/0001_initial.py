# Generated by Django 5.1.4 on 2024-12-22 14:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(blank=True, max_length=50, null=True)),
                ('phone', models.CharField(blank=True, max_length=15, null=True)),
                ('about', models.CharField(blank=True, max_length=30, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('district', models.CharField(blank=True, choices=[('TVM', 'Thiruvananthapuram'), ('KLM', 'Kollam'), ('PTA', 'Pathanamthitta'), ('ALP', 'Alappuzha'), ('KTM', 'Kottayam'), ('IDK', 'Idukki'), ('EKM', 'Ernakulam'), ('TSR', 'Thrissur'), ('PKD', 'Palakkad'), ('MLP', 'Malappuram'), ('KKD', 'Kozhikode'), ('WYD', 'Wayanad'), ('KNR', 'Kannur'), ('KSD', 'Kasaragod')], max_length=3, null=True)),
                ('state', models.CharField(blank=True, choices=[('KL', 'Kerala'), ('TN', 'Tamil Nadu'), ('KA', 'Karnataka')], max_length=2, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_email_verified', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('image', models.ImageField(blank=True, help_text='Upload a profile image', null=True, upload_to='profile_images/')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'User',
                'verbose_name_plural': 'Users',
                'ordering': ['-created_at'],
            },
        ),
    ]
