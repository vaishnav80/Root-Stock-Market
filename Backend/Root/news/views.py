from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from bs4 import BeautifulSoup
import requests
# Create your views here.

class News_data (APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):

        url = "https://finance.yahoo.com/"
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        news_items = soup.find_all('li', class_='story-item')
        news_data = []
        for idx, item in enumerate(news_items):    
            headline = item.find('h3').text if item.find('h3') else "No headline found"
            link = item.find('a')['href'] if item.find('a') else "No link found"
            img_tag = item.find('img')
            img_src = img_tag['src'] if img_tag else "No image found"
            time_tag = item.find('div', class_='publishing yf-1weyqlp') 
            uploaded_time = time_tag.text.strip() if time_tag else "No time found"
            news_item = {
                "headline": headline,
                "link": link,
                "image_url": img_src,
                'uploaded_time': uploaded_time
            }
            news_data.append(news_item)
        
        return Response({
            'Message' : 'News fetched successfuly',
            'data' : news_data
        },status=status.HTTP_200_OK)
