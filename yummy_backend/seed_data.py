import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.menu.models import Category, MenuDish, PopularDish

print("🌱 Seeding database...")

# Clear old data
PopularDish.objects.all().delete()
MenuDish.objects.all().delete()
Category.objects.all().delete()
print("✅ Cleared old data")

# ── Categories ────────────────────────────────────────────────────────────────
cats = {}
for name in ['Breakfast','Dinner','Dessert','BBQ','Chinese','Bread','Drinks','Burgers','Pizza','Biryani']:
    cats[name] = Category.objects.create(name=name)
print(f"✅ Created {len(cats)} categories")

# ── Popular Dishes (shown on homepage) ────────────────────────────────────────
popular_data = [
    ('Yummy Special Pizza', 2500, 'menu_images/1.jpg'),
    ('Zinger Burger', 650, 'menu_images/2.jpg'),
    ('Chicken Biryani', 550, 'menu_images/3.jpg'),
    ('Crispy Fries', 250, 'menu_images/4.jpg'),
    ('Turkish Platter', 1500, 'menu_images/5.jpg'),
    ('Chocolate Cake', 450, 'menu_images/6.jpg'),
]
for name, price, img in popular_data:
    PopularDish.objects.create(name=name, price=price, image=img)
print(f"✅ Created {len(popular_data)} popular dishes")

# ── Menu Dishes ───────────────────────────────────────────────────────────────
menu_data = [
   ('Tea Bread & Eggs', 550, 'menu_images/7.jpg', 'Breakfast'),
    ('Omelette Rancheros', 300, 'menu_images/8.jpg', 'Breakfast'),
    ('Pancakes with Berries', 600, 'menu_images/9.jpg', 'Breakfast'),
    ('French Toast', 350, 'menu_images/10.jpg', 'Breakfast'),

    ('Chole Masala', 150, 'menu_images/11.jpg', 'Dinner'),
    ('Sajji Chicken', 2500, 'menu_images/12.jpg', 'Dinner'),
    ('Kabuli Pulao', 200, 'menu_images/13.jpg', 'Dinner'),
    ('Dal Makhani', 280, 'menu_images/14.jpg', 'Dinner'),

    ('Chicken Biryani', 550, 'menu_images/15.jpg', 'Biryani'),
    ('Beef Biryani', 650, 'menu_images/16.jpg', 'Biryani'),
    ('Prawn Biryani', 850, 'menu_images/17.jpg', 'Biryani'),

    ('Seekh Kabab', 350, 'menu_images/18.jpg', 'BBQ'),
    ('Beef Boti', 400, 'menu_images/19.jpg', 'BBQ'),
    ('Tandoori Chicken', 750, 'menu_images/20.jpg', 'BBQ'),
    ('Chicken Tikka', 650, 'menu_images/21.jpg', 'BBQ'),

    ('Zinger Burger', 650, 'menu_images/22.jpg', 'Burgers'),
    ('Beef Smash Burger', 850, 'menu_images/23.jpg', 'Burgers'),
    ('Chicken Fillet Burger', 700, 'menu_images/24.jpg', 'Burgers'),
    ('Double Cheese Burger', 950, 'menu_images/25.jpg', 'Burgers'),

    ('Yummy Special Pizza', 2500, 'menu_images/26.jpg', 'Pizza'),
    ('Pepperoni Pizza', 1800, 'menu_images/27.jpg', 'Pizza'),
    ('BBQ Chicken Pizza', 2000, 'menu_images/28.jpg', 'Pizza'),

    ('Corn Chicken Soup', 250, 'menu_images/29.jpg', 'Chinese'),
    ('Chow Mein', 400, 'menu_images/30.jpg', 'Chinese'),
    ('Fried Rice', 350, 'menu_images/31.jpg', 'Chinese'),
    ('Spring Rolls', 200, 'menu_images/32.jpg', 'Chinese'),

    ('Gulab Jamun', 150, 'menu_images/33.jpg', 'Dessert'),
    ('Chocolate Cake', 450, 'menu_images/34.jpg', 'Dessert'),
    ('Mango Kulfi', 200, 'menu_images/35.jpg', 'Dessert'),
    ('Jalebi', 120, 'menu_images/36.jpg', 'Dessert'),

    ('Mango Lassi', 200, 'menu_images/37.jpg', 'Drinks'),
    ('Fresh Lemonade', 150, 'menu_images/38.jpg', 'Drinks'),
    ('Mint Margarita', 180, 'menu_images/39.jpg', 'Drinks'),
    ('Cold Coffee', 220, 'menu_images/40.jpg', 'Drinks'),

    ('Garlic Naan', 60, 'menu_images/41.jpg', 'Bread'),
    ('Tandoori Roti', 20, 'menu_images/42.jpg', 'Bread'),
    ('Paratha', 50, 'menu_images/43.jpg', 'Bread'),
]

for name, price, img, cat_name in menu_data:
    MenuDish.objects.create(
        name     = name,
        price    = price,
        image    = img,
        category = cats[cat_name]
    )
print(f"✅ Created {len(menu_data)} menu dishes")
print("\n🎉 Database seeded successfully!")
print("Popular dishes:", PopularDish.objects.count())
print("Menu dishes:   ", MenuDish.objects.count())
print("Categories:    ", Category.objects.count())