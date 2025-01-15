from rest_framework import serializers
from . models import Lesson,Lesson_content,Quiz,Answer,Attended

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id','heading']

    def validate_heading(self,value):
        print(value)
        if Lesson.objects.filter(heading = value).exists():
            raise serializers.ValidationError('same heading  already exist')
        return value



class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson_content
        fields = '__all__'

    def validate_image(self, value):
        if value:
            if not value.name.lower().endswith(('.png', '.jpg', '.jpeg','.webp')):
                raise serializers.ValidationError("Only image files are allowed (png, jpg, jpeg).")
        return value
    

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['answer_text', 'is_correct','id']

class QuizSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        
        model = Quiz
        fields = ['question', 'created_at', 'answers','id']
        read_only_fields = ['created_at']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers', [])
        quiz = Quiz.objects.create(**validated_data)
        for answer_data in answers_data:
            Answer.objects.create(question_id=quiz, **answer_data)
        return quiz

    def update(self, instance, validated_data):
        answers_data = validated_data.pop('answers', [])
        instance.question = validated_data.get('question', instance.question)
        instance.save()
        instance.answers.all().delete() 
        for answer_data in answers_data:
            Answer.objects.create(question_id=instance, **answer_data)
        return instance


class QuizAttendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attended
        fields = '__all__'