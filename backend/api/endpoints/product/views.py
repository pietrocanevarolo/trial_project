from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Product
from api.serializers import ProductSerializer
from django.db.models import Q

class ProductListView(APIView):

    def get(self, request):

        
        # Gestire la ricerca tramite query string
        search_query = request.query_params.get('search', '')
        # Filtrare i prodotti che contengono la stringa di ricerca nel nome o descrizione
        products = Product.objects.filter(
            Q(name__icontains=search_query) | Q(description__icontains=search_query)
        )

        # Ordinare i prodotti
        sort_field = request.query_params.get('sort', 'name')  # Default sorting by name
        if sort_field not in ['id', 'name', 'price', 'stock']:
            sort_field = 'name'  # Default fallback
        products = products.order_by(sort_field)

        # Serializzare i dati
        serializer = ProductSerializer(products, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        # Gestire la selezione del prodotto
        product_id = request.data.get('id')
        if not product_id:
            return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        # Aggiornare il prodotto come selezionato
        product.selected = not product.selected
        product.save()

        return Response({'id': product.id, 'selected': product.selected}, status=status.HTTP_200_OK)
    
    def patch(self, request):
        # Aggiornare i dettagli del prodotto
        product_id = request.data.get('id')
        if not product_id:
            return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        # Modificare il valore del campo selected
        if 'selected' in request.data:
            product.selected = request.data['selected']
        
        # Aggiornare altri campi se forniti
        allowed_fields = ['name', 'description', 'price', 'stock']
        for field, value in request.data.items():
            if field in allowed_fields:
                setattr(product, field, value)

        product.save()

        # Serializzare il prodotto aggiornato
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)