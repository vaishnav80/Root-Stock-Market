
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import Wishlistserializer
from .models import WatchList
import finnhub # type: ignore
from transformers import AutoTokenizer, AutoModelForSequenceClassification,pipeline # type: ignore
import requests
class Analysis(APIView):

    permission_classes = [IsAuthenticated]
    def post(self,request):
        company = request.data.get('company')
        finnhub_client = finnhub.Client(api_key="cu5r78hr01qujm3p54d0cu5r78hr01qujm3p54dg")
        print(company,'company')
        articles = finnhub_client.company_news(company, _from="2024-12-01", to="2025-12-10")
        lst = ''
        print(articles)
        if len(articles)<5:
            n= len(articles)
        else:
            n = 5
        for article in articles[0:n+1]:
            print(article['headline'])
            lst += article['headline']+' '

        print(lst)
        tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
        model = AutoModelForSequenceClassification.from_pretrained("ProsusAI/finbert")
        pipe = pipeline("text-classification", model="ProsusAI/finbert",tokenizer=tokenizer)
        sentence = [lst]
        res = pipe(sentence)
        print(res)
        return Response({
            "message" : "Analysis completed",
            "data" : res
        },status=status.HTTP_200_OK)
    

class WatchLists(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self,request):
        company = request.data.get('company')

        API_KEY = "HXLHDDVTUTGJUUP2"
        
        url = f"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={company}&apikey={API_KEY}"

        symbols = []
        response = requests.get(url).json()
        print(response)
        try:
            for match in response['bestMatches']:
                print(f"Symbol: {match['1. symbol']}, Name: {match['2. name']}")
                symbols.append(match['1. symbol'])
         
            bse_symbols = [symbol.replace('.BSE', '') for symbol in symbols if symbol.endswith('.BSE')]
        except:
            return Response({
                "message" : "There is some techincal issues please try again later"
            },status=status.HTTP_400_BAD_REQUEST)

        print(bse_symbols,company)
        if not company or  len(bse_symbols)==0:
            return Response({
                "message" : "invalid company name please check again"
            },status=status.HTTP_400_BAD_REQUEST)

        data = {
            "company" : company,
            "symbol" : bse_symbols[0],
            "user_id" : request.user.id
        }
        serializer = Wishlistserializer(data = data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()

            return Response({
                "message" : "company added ",
                "data" : serializer.data
            },status=status.HTTP_201_CREATED)
        
        else :
            return Response({
                "message" : " invalid input"
            },status= status.HTTP_404_NOT_FOUND)


    def get(self,request):
        try:
            print('hello')
            user = request.user
            print(user)
            data = WatchList.objects.filter(user_id = user.id)
            print(data)
            serializer= Wishlistserializer(data ,many =True)
            print(serializer)
            return Response({
                    "message" : "data Fetched succesfully",
                    "data" : serializer.data
                },status=status.HTTP_200_OK)
            
        except:
            return Response({
                "message" : "invalid"
            },status=status.HTTP_404_NOT_FOUND)
