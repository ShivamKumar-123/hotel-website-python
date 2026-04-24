"""Load demo rooms, staff user, and sample reviews for local development."""
from decimal import Decimal

from django.core.management.base import BaseCommand

from apps.bookings.models import Booking
from apps.reviews.models import Review
from apps.rooms.models import Room
from apps.users.models import User


class Command(BaseCommand):
    help = 'Creates demo users, rooms, bookings, and reviews (safe to re-run; skips existing emails).'

    def handle(self, *args, **options):
        admin, _ = User.objects.get_or_create(
            email='admin@aurumgrand.com',
            defaults={
                'username': 'admin',
                'first_name': 'Aurum',
                'last_name': 'Admin',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True,
            },
        )
        if _:
            admin.set_password('admin12345')
            admin.save()
            self.stdout.write(self.style.SUCCESS('Admin: admin@aurumgrand.com / admin12345'))

        staff, _ = User.objects.get_or_create(
            email='concierge@aurumgrand.com',
            defaults={
                'username': 'concierge',
                'first_name': 'Guest',
                'last_name': 'Services',
                'role': User.Role.STAFF,
                'is_staff': True,
            },
        )
        if _:
            staff.set_password('staff12345')
            staff.save()
            self.stdout.write(self.style.SUCCESS('Staff: concierge@aurumgrand.com / staff12345'))

        guest, _ = User.objects.get_or_create(
            email='guest@example.com',
            defaults={
                'username': 'guestdemo',
                'first_name': 'Jordan',
                'last_name': 'Lee',
                'role': User.Role.GUEST,
            },
        )
        if _:
            guest.set_password('guest12345')
            guest.save()
            self.stdout.write(self.style.SUCCESS('Guest: guest@example.com / guest12345'))

        demo_rooms = [
            {
                'name': 'The Penthouse Suite',
                'slug': 'penthouse-suite',
                'description': 'Panoramic skyline views, private terrace, and a deep soaking tub for the ultimate urban escape.',
                'price_per_night': Decimal('1299.00'),
                'max_guests': 4,
                'size_sqm': 120,
                'bed_type': 'King',
                'has_ac': True,
                'has_balcony': True,
                'garden_facing': False,
                'washroom_type': Room.WashroomType.WESTERN,
                'amenities': ['Butler service', 'Wine cellar', 'Spa bathroom', 'Smart suite controls'],
                'cover_image': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
                    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
                ],
                'is_featured': True,
            },
            {
                'name': 'Deluxe Skyline',
                'slug': 'deluxe-skyline',
                'description': 'Floor-to-ceiling glass, curated minibar, and Italian linens in a calm, monochromatic palette.',
                'price_per_night': Decimal('449.00'),
                'max_guests': 2,
                'size_sqm': 42,
                'bed_type': 'King',
                'has_ac': True,
                'has_balcony': False,
                'garden_facing': False,
                'washroom_type': Room.WashroomType.WESTERN,
                'amenities': ['Rain shower', 'Nespresso', 'Evening turndown'],
                'cover_image': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
                ],
                'is_featured': True,
            },
            {
                'name': 'Garden Atelier',
                'slug': 'garden-atelier',
                'description': 'Quiet courtyard outlook, writing desk, and a marble bath designed for slow mornings.',
                'price_per_night': Decimal('329.00'),
                'max_guests': 2,
                'size_sqm': 36,
                'bed_type': 'Queen',
                'has_ac': True,
                'has_balcony': False,
                'garden_facing': True,
                'washroom_type': Room.WashroomType.INDIAN,
                'amenities': ['Soaking tub', 'Yoga mat', 'Herbal tea selection'],
                'cover_image': 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200&q=80',
                'gallery': [],
                'is_featured': False,
            },
            {
                'name': 'Executive Twin',
                'slug': 'executive-twin',
                'description': 'Ideal for colleagues traveling together — twin beds, soundproofing, and a generous work wall.',
                'price_per_night': Decimal('289.00'),
                'max_guests': 2,
                'size_sqm': 34,
                'bed_type': 'Twin',
                'has_ac': True,
                'has_balcony': False,
                'garden_facing': False,
                'washroom_type': Room.WashroomType.WESTERN,
                'amenities': ['Ergonomic chairs', 'High-speed Wi‑Fi', 'Blackout shades'],
                'cover_image': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
                'gallery': [],
                'is_featured': False,
            },
            {
                'name': 'Heritage Garden (Non-AC)',
                'slug': 'heritage-garden-non-ac',
                'description': 'Ceiling fans, garden-facing windows, and a traditional Indian bath — calm, cool stone underfoot.',
                'price_per_night': Decimal('199.00'),
                'max_guests': 3,
                'size_sqm': 32,
                'bed_type': 'Queen',
                'has_ac': False,
                'has_balcony': False,
                'garden_facing': True,
                'washroom_type': Room.WashroomType.INDIAN,
                'amenities': ['Ceiling fans', 'Garden sit-out', 'Filtered drinking water'],
                'cover_image': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
                'gallery': [],
                'is_featured': False,
            },
            {
                'name': 'Veranda Balcony King',
                'slug': 'veranda-balcony-king',
                'description': 'Private Juliet balcony, full climate control, and a western rain shower.',
                'price_per_night': Decimal('379.00'),
                'max_guests': 2,
                'size_sqm': 38,
                'bed_type': 'King',
                'has_ac': True,
                'has_balcony': True,
                'garden_facing': False,
                'washroom_type': Room.WashroomType.WESTERN,
                'amenities': ['Balcony seating', 'Dimmable scenes', 'Linen service'],
                'cover_image': 'https://images.unsplash.com/photo-1566665797729-024c6dac2edf?w=1200&q=80',
                'gallery': [],
                'is_featured': False,
            },
            {
                'name': 'Family Garden Suite',
                'slug': 'family-garden-suite',
                'description': 'Two quiet bedrooms, garden light all afternoon, western ensuite — space for four without noise.',
                'price_per_night': Decimal('559.00'),
                'max_guests': 4,
                'size_sqm': 68,
                'bed_type': 'King',
                'has_ac': True,
                'has_balcony': False,
                'garden_facing': True,
                'washroom_type': Room.WashroomType.WESTERN,
                'amenities': ['Connecting lounge', 'Garden terrace access', 'Extra beds on request'],
                'cover_image': 'https://images.unsplash.com/photo-1582719508461-9050b1f7e436?w=1200&q=80',
                'gallery': [],
                'is_featured': False,
            },
            {
                'name': 'Courtyard Twin (Non-AC)',
                'slug': 'courtyard-twin-non-ac',
                'description': 'Cross-ventilation over the courtyard, twin beds, Indian-style wash — simple and honest.',
                'price_per_night': Decimal('169.00'),
                'max_guests': 2,
                'size_sqm': 28,
                'bed_type': 'Twin',
                'has_ac': False,
                'has_balcony': False,
                'garden_facing': False,
                'washroom_type': Room.WashroomType.INDIAN,
                'amenities': ['Cross breeze', 'Heritage tiles', 'Shared courtyard view'],
                'cover_image': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
                'gallery': [],
                'is_featured': False,
            },
        ]

        for data in demo_rooms:
            slug = data.pop('slug')
            room, created = Room.objects.update_or_create(slug=slug, defaults=data)
            action = 'Created' if created else 'Updated'
            self.stdout.write(f'{action} room: {room.name}')

        if guest.pk and Room.objects.exists():
            room = Room.objects.filter(slug='deluxe-skyline').first() or Room.objects.first()
            if not Booking.objects.filter(user=guest, room=room).exists():
                Booking.objects.create(
                    user=guest,
                    room=room,
                    check_in='2026-05-01',
                    check_out='2026-05-04',
                    guests=2,
                    total_price=room.price_per_night * 3,
                    status=Booking.Status.CONFIRMED,
                )
                self.stdout.write('Sample booking created for guest demo.')

        if guest.pk:
            r = Room.objects.filter(slug='penthouse-suite').first()
            if r and not Review.objects.filter(user=guest, room=r).exists():
                Review.objects.create(
                    user=guest,
                    room=r,
                    rating=5,
                    comment='Flawless stay — the team anticipated every detail.',
                    is_approved=True,
                )
        if admin.pk and not Review.objects.filter(user=admin, room__isnull=True).exists():
            Review.objects.create(
                user=admin,
                room=None,
                rating=5,
                comment='A sanctuary above the city. We return every season.',
                is_approved=True,
            )

        self.stdout.write(self.style.SUCCESS('Demo seed complete.'))
