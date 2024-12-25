from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LessonSerializer
from .models import Lesson

class Lessons(APIView):

    permission_classes =[IsAuthenticated]

    def post(self,request):

        serializer = LessonSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            serializer.save() 
            return Response({
                "message": "Lesson added successfully",
                "lesson": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "message": "Failed to add lesson",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    

    def get(self,request):
        try:
            topic = Lesson.objects.all().order_by('id')
            print(topic)
            serializer = LessonSerializer(topic, many=True)
            print(serializer)
            return Response({
                    "lesson": serializer.data
                })
        except Exception as e:
            return Response({
                "message": "Error retrieving lesson details",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)