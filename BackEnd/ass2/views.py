from django.shortcuts import render

# Create your views here.

from django.db.models import Q 
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Product, Cart, CartItem, UserProfile
from .serializers import (
    ProductSerializer, CartSerializer, CartItemSerializer, AddToCartSerializer,
    RegisterSerializer, UserSerializer, AdminCartSerializer
)
from .permissions import IsAdminUser

# 商品视图集（增加搜索功能）
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]   # 添加这一行，允许匿名访问

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def search(self, request):
        keyword = request.query_params.get('q', '')
        if keyword:
            products = Product.objects.filter(
                Q(name__icontains=keyword) | Q(description__icontains=keyword)
            )
        else:
            products = Product.objects.all()
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

# 购物车视图集（使用 request.user 认证，移除 user_id 参数）
class CartViewSet(viewsets.GenericViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]   # 要求登录

    def get_cart(self, user):
        cart, created = Cart.objects.get_or_create(user=user)
        return cart

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        cart = self.get_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data.get('quantity', 1)
        product = get_object_or_404(Product, pk=product_id)
        cart = self.get_cart(request.user)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'])
    def remove(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id required'}, status=status.HTTP_400_BAD_REQUEST)
        cart = self.get_cart(request.user)
        deleted_count, _ = CartItem.objects.filter(cart=cart, product_id=product_id).delete()
        if deleted_count == 0:
            return Response({'error': 'Product not found in cart'}, status=status.HTTP_404_NOT_FOUND)
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=['patch'])
    def update_quantity(self, request):
        product_id = request.data.get('product_id')
        new_quantity = request.data.get('quantity')
        if not product_id or new_quantity is None:
            return Response({'error': 'product_id and quantity required'}, status=400)
        try:
            new_quantity = int(new_quantity)
            if new_quantity < 0:
                raise ValueError
        except ValueError:
            return Response({'error': 'quantity must be non-negative integer'}, status=400)
        cart = self.get_cart(request.user)
        cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
        if new_quantity == 0:
            cart_item.delete()
        else:
            cart_item.quantity = new_quantity
            cart_item.save()
        return Response(CartSerializer(cart).data)

# 用户注册视图
class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

# 获取当前用户信息（用于前端显示角色等）
class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

# 管理员查看所有用户的购物车
class AdminAllCartsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = AdminCartSerializer
    queryset = Cart.objects.all().select_related('user').prefetch_related('items__product')

# 可选：自定义 JWT 登录视图（使用 simplejwt 默认即可，无需修改）