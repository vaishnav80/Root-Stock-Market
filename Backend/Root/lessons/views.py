from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LessonSerializer,ContentSerializer,QuizSerializer,AnswerSerializer,QuizAttendSerializer
from .models import Lesson,Lesson_content,Quiz,Answer,Attended
from random import sample
from django.db.models import Subquery


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
            topic = Lesson.objects.all().order_by('order')
          
            serializer = LessonSerializer(topic, many=True)
            
            return Response({
                    "lesson": serializer.data
                },status=status.HTTP_200_OK)
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
            serializer = LessonSerializer(topic, data=request.data)
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
            sub_heading = data.get('sub_heading')
            if sub_heading and sub_heading != topic.sub_heading:
                data['sub_heading'] = sub_heading

            data['image'] = request.FILES.get('image', topic.image)

            serializer = ContentSerializer(topic, data=data, partial=True) 
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "Content updated successfully",
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



class Quiz_data(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):

        try:
            quiz = Quiz.objects.prefetch_related('answers').all()
            
            serializer = QuizSerializer(quiz,many = True)
           
            return Response({
                        "message": "content fetched successfully",
                        "content": serializer.data
                    }, status=status.HTTP_200_OK)
        except:
            return Response({
                    "message": "content not found",
                    "errors": "invalid id"
                }, status=status.HTTP_404_NOT_FOUND)
        
    def post(self,request):

        question = request.data.get('question')
        options = request.data.get('option')
        correct = request.data.get('correct_answer')
        data = {
            "question" : question,
            "answers" : [
                {"answer_text": text, "is_correct": key == correct}
                for key, text in options.items()
            ]
        }
        print(data)
        serializer = QuizSerializer(data = data)
        print('dfgdf',serializer)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "created successfully",
                "quiz" : serializer.data

            },status=status.HTTP_201_CREATED)
        else:
            return Response({
            "message": "Failed to add quiz",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    


class Quiz_edit(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self,request,id):
        
        try:
            quiz = Quiz.objects.get(id = id)
            print(quiz)
            quiz.delete()
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
        
    def post(self,request,id):

        question = request.data.get('question')
        options = request.data.get('option')
        correct = request.data.get('correct_answer')
        data = {
            "question" : question,
            "answers" : [
                {"answer_text": text, "is_correct": key == correct}
                for key, text in options.items()
            ]
        }
        print(data)
        q = Quiz.objects.prefetch_related('answers').get(id= id)
        serializer = QuizSerializer(q,data = data)
        print('dfgdf',serializer)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "updated successfully",
                "quiz" : serializer.data

            },status=status.HTTP_201_CREATED)
        else:
            return Response({
            "message": "Failed to update quiz",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        

class Quiz_attend(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):

        try:

            user_id = request.user.id  
            attended_ids = Attended.objects.filter(user_id=user_id).values_list('question_id', flat=True)
            ids = list(Quiz.objects.exclude(id__in=Subquery(attended_ids)).values_list('id', flat=True))
            # ids = list(Quiz.objects.values_list('id', flat=True))
            random_ids = sample(ids, min(len(ids), 5))
            quiz = Quiz.objects.prefetch_related('answers').filter(id__in=random_ids)
            print(quiz)
            serializer = QuizSerializer(quiz,many = True)
            return Response({
                        "message": "content fetched successfully",
                        "content": serializer.data
                    }, status=status.HTTP_200_OK)
        except:
            return Response({
                    "message": "content not found",
                    "errors": "invalid id"
                }, status=status.HTTP_404_NOT_FOUND)
        
    def post(self,request):
        
        question_id = request.data.get('question')
        
        user_id = request.user.id
        data = {
            'question_id' : question_id,
            'user_id' : user_id
        }
        serializer = QuizAttendSerializer(data= data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message' : "Added successfully",
            },status=status.HTTP_201_CREATED)
        else:
            return Response({
            "message": "Failed to add attended",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class OrderLesson(APIView):
    permission_classes = [IsAuthenticated]

    def post (self,request):
        new_order = request.data.get("newOrder", [])
        print(new_order)
        if not new_order:
            return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

        order = 0
        for item in new_order:
            try:
                obj = Lesson.objects.get(id=item["id"])
                obj.order = order
                obj.save()
                order+=1
            except Lesson.DoesNotExist:
                return Response({"error": f"Item with ID {item['id']} not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Order updated successfully"}, status=status.HTTP_200_OK)