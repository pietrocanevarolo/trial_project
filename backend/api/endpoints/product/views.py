from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import Product
from api.serializers import ProductSerializer

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', '')
        if search:
            queryset = queryset.filter(name__icontains=search)
        sort_by = self.request.query_params.get('sort_by', 'id')
        return queryset.order_by(sort_by)

    @action(detail=True, methods=['post'])
    def select(self, request, pk=None):
        product = self.get_object()
        product.selected = True
        product.save()
        serializer = self.get_serializer(product)
        return Response(serializer.data)
