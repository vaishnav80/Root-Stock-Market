from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
import json
import asyncio
import requests
from bs4 import BeautifulSoup
import logging
from order.models import Investment
from account.models import CustomUser
logger = logging.getLogger(__name__)

class StockPriceConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        try:
            logger.debug("Attempting to connect")
            await self.accept()
      
            self.ticker = 'TCS'
            self.exchange = 'NSE'
            self.url = self._get_url()
            self.task = asyncio.create_task(self.send_stock_price())
          
        except Exception as e:
            logger.error(f"Error in connect: {str(e)}")
            raise

    def _get_url(self):

        return f'https://www.google.com/finance/quote/{self.ticker}:{self.exchange}?'

    async def disconnect(self, close_code):
        if self.task:
            self.task.cancel()
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if 'ticker' in data and 'exchange' in data:
                if self.task:
                    self.task.cancel()

                self.ticker = data['ticker']
                self.exchange = data['exchange']
                self.url = self._get_url()

                self.task = asyncio.create_task(self.send_stock_price())
                print(self.task,'dffdf')
                await self.send(json.dumps({
                    'message': f'Updated to {self.ticker}:{self.exchange}'
                }))

        except json.JSONDecodeError:
            await self.send(json.dumps({
                'error': 'Invalid JSON format'
            }))
        except Exception as e:
            await self.send(json.dumps({
                'error': str(e)
            }))

    async def send_stock_price(self):
        print('dfsdfsdsdfsdads')
        while True:
            try:
                response = requests.get(self.url)
                soup = BeautifulSoup(response.text, 'html.parser')
                class1 = "YMlKec fxKbKc"
                price = float(soup.find(class_=class1).text.strip()[1:].replace(",", ""))
                await self.send(json.dumps({
                    'price': price,
                    'ticker': self.ticker,
                    'exchange': self.exchange
                }))
            except Exception as e:
                logger.error(f"Error fetching price: {e}")
                await self.send(json.dumps({'error': str(e)}))
            await asyncio.sleep(10)


class StockList(AsyncWebsocketConsumer):

    async def connect(self):
        try:    
            logger.debug("Attempting to connect")
            await self.accept()
            self.list = ['TATAMOTORS','TCS','INFY','BAJAJ-AUTO','ICICIBANK','RELIANCE','HDFCBANK','TATASTEEL','SUNPHARMA']
            self.exchange = 'NSE'
            self.data = {}
            self.task = asyncio.create_task(self.send_stock_price())
          
        except Exception as e:
            logger.error(f"Error in connect: {str(e)}")
            raise
  

    async def disconnect(self, close_code):
        if self.task:
            self.task.cancel()

    async def send_stock_price(self):
        while True:
            try:
                for i in self.list:
                    self.url = f'https://www.google.com/finance/quote/{i}:{self.exchange}?'
                    response = requests.get(self.url)
                    soup = BeautifulSoup(response.text, 'html.parser')
                    class1 = "YMlKec fxKbKc"

                    price = float(soup.find(class_=class1).text.strip()[1:].replace(",", ""))
                    self.data[i] = price
                await self.send(json.dumps({
                    'data': self.data,
                }))
            except Exception as e:
                logger.error(f"Error fetching price: {e}")
                await self.send(json.dumps({'error': str(e)}))
            await asyncio.sleep(10)

            

from asgiref.sync import sync_to_async
from urllib.parse import parse_qs
class UserStockList(AsyncWebsocketConsumer):

    async def connect(self):
        try:    
            logger.debug("Attempting to connect")
            await self.accept()
            query_string = self.scope['query_string'].decode()
          
            params = parse_qs(query_string)
             
            user= params.get('user_id', [None])[0]
       
            self.list = await sync_to_async(self.get_user_investments)(user)
            print(self.list)
            
            self.exchange = 'NSE'
            self.data = {}
            self.task = asyncio.create_task(self.send_stock_price())

        except Exception as e:
            logger.error(f"Error in connect: {str(e)}")
            raise

    async def disconnect(self, close_code):
        if self.task:
            self.task.cancel()

    async def send_stock_price(self):
        while True:
            try:
                for i in self.list:
                    self.url = f'https://www.google.com/finance/quote/{i}:{self.exchange}?'
                    response = requests.get(self.url)
                    soup = BeautifulSoup(response.text, 'html.parser')
                    class1 = "YMlKec fxKbKc"

                    price = float(soup.find(class_=class1).text.strip()[1:].replace(",", ""))
                    self.data[i] = price
                await self.send(json.dumps({
                    'data': self.data,
                }))
            except Exception as e:
                logger.error(f"Error fetching price: {e}")
                await self.send(json.dumps({'error': str(e)}))
            await asyncio.sleep(10)

    def get_user_investments(self, user):
        user_id = CustomUser.objects.get(email = user)
        print(user_id)
        return list(Investment.objects.filter(user_id=user_id.id).values_list('company', flat=True))
