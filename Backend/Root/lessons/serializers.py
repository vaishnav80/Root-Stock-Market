from rest_framework import serializers
from . models import Lesson,Lesson_content

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id','heading']




class LessonUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'heading']

    def validate(self, data):
        heading = data.get("heading")
        print(heading,'headis')
        if not heading:
            raise serializers.ValidationError("Heading is required.")
        return data
    def validate_heading(self,data):
        if Lesson.objects.filter(heading = data).exists():
            raise serializers.ValidationError('same heading  already exist')


class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson_content
        fields = '__all__'

    def validate_sub_heading(self,value):
        if Lesson_content.objects.filter(sub_heading = value).exists():
            raise serializers.ValidationError('sub heading already exist ')
        return value
    
    def validate_image(self, value):
        if value:
            if not value.name.lower().endswith(('.png', '.jpg', '.jpeg','.webp')):
                raise serializers.ValidationError("Only image files are allowed (png, jpg, jpeg).")
        return value