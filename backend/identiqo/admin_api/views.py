# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .serializers import AdminRegistrationSerializer, AdminLoginSerializer
# from .models import AdminUser
# from django.contrib.auth.hashers import check_password
# from .models import SubscriptionPlan
# from .serializers import SubscriptionPlanSerializer
# import json


# @api_view(['POST'])
# def admin_register(request):
#     """
#     API endpoint for admin registration
#     """
#     serializer = AdminRegistrationSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({
#             'message': 'Admin registered successfully',
#             'data': {
#                 'email': serializer.data['email'],
#                 'full_name': serializer.data.get('full_name'),
#                 'phone': serializer.data.get('phone')
#             }
#         }, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# def admin_login(request):
#     """
#     API endpoint for admin login
#     """

#     serializer = AdminLoginSerializer(data=request.data)

#     if serializer.is_valid():

#         email = serializer.validated_data['email']
#         password = serializer.validated_data['password']

#         try:
#             admin = AdminUser.objects.get(email=email)

#         except AdminUser.DoesNotExist:
#             return Response({
#                 'message': 'Invalid email or password'
#             }, status=status.HTTP_401_UNAUTHORIZED)

#         # Check password
#         if not check_password(password, admin.password):
#             return Response({
#                 'message': 'Invalid email or password'
#             }, status=status.HTTP_401_UNAUTHORIZED)

#         # Check admin status
#         if not admin.status:
#             return Response({
#                 'message': 'Account is inactive'
#             }, status=status.HTTP_403_FORBIDDEN)

#         return Response({
#             'message': 'Login successful',
#             'data': {
#                 'id': admin.id,
#                 'email': admin.email,
#                 'full_name': admin.full_name,
#                 'phone': admin.phone,
#                 'status': admin.status
#             }
#         }, status=status.HTTP_200_OK)

#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # @api_view(['POST'])
# # def add_subscription_plan(request):

# #     serializer = SubscriptionPlanSerializer(data=request.data)

# #     if serializer.is_valid():
# #         serializer.save()

# #         return Response({
# #             'message': 'Subscription plan created successfully',
# #             'data': serializer.data
# #         }, status=status.HTTP_201_CREATED)

# #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['POST'])
# def add_subscription_plan(request):

#     data = request.data.copy()

#     if 'features' in data:
#         data['features'] = json.loads(data['features'])

#     serializer = SubscriptionPlanSerializer(data=data)

#     if serializer.is_valid():admin
#         serializer.save()

#         return Response({
#             'message': 'Subscription plan created successfully',
#             'data': serializer.data
#         }, status=status.HTTP_201_CREATED)

#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# @api_view(['GET'])
# def subscription_plan_list(request):

#     plans = SubscriptionPlan.objects.all().order_by('-id')

#     serializer = SubscriptionPlanSerializer(plans, many=True)

#     return Response({
#         'message': 'Subscription plan list',
#         'data': serializer.data
#     }, status=status.HTTP_200_OK)
