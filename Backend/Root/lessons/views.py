from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LessonSerializer,LessonUpdateSerializer,ContentSerializer
from .models import Lesson,Lesson_content

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
          
            serializer = LessonSerializer(topic, many=True)
            
            return Response({
                    "lesson": serializer.data
                })
        except Exception as e:
            return Response({
                "message": "Error retrieving lesson details",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
        
class Delete_lesson(APIView):

    permission_classes =[IsAuthenticated]

    def post(self,request,id):
        
        try:
            topic = Lesson.objects.get(id = id)
            topic.delete()
            return Response({
            "message": "Lesson deleted successfully"
        }, status=status.HTTP_200_OK)
        except Lesson.DoesNotExist:
            return Response({
                "message": "Lesson not found"
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "message": "Failed to delete lesson",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request, id):
        try:
         
            topic = Lesson.objects.get(id=id)
            serializer = LessonUpdateSerializer(topic, data=request.data)
            print(serializer,'data')
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "Lesson updated successfully",
                    "lesson": serializer.data
                }, status=status.HTTP_200_OK)
            else:
             
                return Response({
                    "message": "Failed to update lesson",
                    "errors": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        
        except Lesson.DoesNotExist:
            return Response({
                "message": "Lesson not found"
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "message": "Failed to update lesson",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    


class Content(APIView):
    permission_classes =[IsAuthenticated]

    def get(self,request,id):
        try:
            print(id,'id')
            content = Lesson_content.objects.filter(heading_id = id)
            print(content)
            serializer = ContentSerializer(content,many = True)
            print(serializer)
            return Response({
                    "message": "content fetched successfully",
                    "content": serializer.data
                }, status=status.HTTP_200_OK)
    
        except:
            return Response({
                    "message": "content not found",
                    "errors": "invalid id"
                }, status=status.HTTP_404_NOT_FOUND)

    def post(self,request,id):
           
        data = request.data
        print(data)
        data = request.data.copy() 
        data['image'] = request.FILES.get('image')
        print(data)
        serializer = ContentSerializer(data=data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response ({
                "message" : "content added Successfully",
                "content" : serializer.data
            },status= status.HTTP_201_CREATED)
        return Response({
            "message": "Failed to add Content",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,id):

        try:
            topic = Lesson_content.objects.get(id = id)
            topic.delete()
            return Response({
            "message": "Content deleted successfully"
        }, status=status.HTTP_200_OK)
        except Lesson_content.DoesNotExist:
            return Response({
                "message": "content not found"
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "message": "Failed to delete Content",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        




    def patch(self, request, id):
        try:
            topic = Lesson_content.objects.get(id=id)
            data = request.data.copy()
            data['image'] = request.FILES.get('image')
            serializer = ContentSerializer(topic, data=data)
            
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "content updated successfully",
                    "lesson": serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "message": "Failed to update content",
                    "errors": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Lesson_content.DoesNotExist:
            return Response({
                "message": "Content not found"
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "message": "Failed to update content",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
