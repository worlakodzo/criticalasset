from email.policy import default
from enum import unique
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Boolean,Float,Date
from flask import Flask, request

# List of status
STATUS_LIST = [
    {
        "id":1,
        "name": "Archived"
    },
    {
        "id":2,
        "name": "Pending"
    },
    {
        "id":3,
        "name": "Ready to Deploy"
    }
]

# List of supplier
SUPPLIER_LIST = [
    {
        "id":1,
        "name": "Supplier 1"
    },
    {
        "id":2,
        "name": "Supplier 2"
    },
    {
        "id":3,
        "name": "Supplier 3"
    }
]

# List of companies
COMPANY_LIST = [
    {
        "id":1,
        "name": "Company 1"
    },
    {
        "id":2,
        "name": "Company 2"
    },
    {
        "id":3,
        "name": "Company 3"
    }
]

# List of category
CATEGORY_LIST = [
    {
        "id":1,
        "name": "Antivirus"
    },
    {
        "id":2,
        "name": "Misc Software"
    },
    {
        "id":3,
        "name": "Windows"
    },
    {
        "id":4,
        "name": "Linux"
    }
]

# List of manufacturer
MANUFACTURER_LIST = [
    {
        "id":1,
        "name": "Apache"
    },{
        "id":2,
        "name": "Apple Inc"
    }
]




# Initialize database
# connection
db = SQLAlchemy()
def setup_db(app:Flask, path):
    app.config["SQLALCHEMY_DATABASE_URI"] = path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    return db


def create_db():

    # Create all tables into 
    # the database
    db.create_all()


    # retrieve user
    user = User.query.filter(User.username == "admin").one_or_none()

    # create default if it
    # does not exist
    if not user:
        # Create a default user
        hash_password = User.get_hashed_password("admin")
        user = User(
            username= "admin",
            password= hash_password,
            is_active= True,
            is_admin= True
        )

        # insert the default user
        # into database
        user.insert()   


class User(db.Model):
    id = Column(Integer, primary_key= True)
    username = Column(String, nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    is_active = Column(Boolean, nullable=False)
    is_admin = Column(Boolean, nullable=False)


    # Constructor
    def __init__(
        self,
        username,
        password,
        is_active,
        is_admin
        ):

        self.username = username
        self.password = password
        self.is_active = is_active
        self.is_admin = is_admin


    

    def insert(self):
        # create new user
        db.session.add(self)
        db.session.commit()

    def update(self):
        # update existing user
        db.session.commit()


    def delete(self):
        # delete a user
        db.session.delete(self)
        db.session.commit()

    
    @staticmethod
    def get_hashed_password(raw_password):
        # import hash library
        from hashlib import sha256

        # hash password and return hashed value
        return sha256(str(raw_password).encode('utf-8')).hexdigest()

    @staticmethod
    def verify_user(user, raw_password):

        new_hashed_password = User.get_hashed_password(raw_password)

        # return true if new-hashed password
        # is equal to user hashed password in database
        if user.password == new_hashed_password:
            return True
        else:
            return False


    def format(self):
        # Json format
        # of the user data
        return {
            "user_id": self.id,
            "username": self.username,
            "is_active": self.is_active,
            "is_admin": self.is_admin
            }



class Asset(db.Model):
    id = Column(Integer, primary_key = True)
    company = Column(String(100), nullable= True, default = " ")
    asset_name = Column(String(100), nullable= False)
    tags = Column(String(50), nullable= False)
    serial_number = Column(String(50), nullable= False)
    model = Column(String(50), nullable= False)
    status = Column(String(50), nullable= False)
    purchase_date = Column(Date, nullable= False)
    supplier = Column(String(100), nullable= True, default = " ")
    order_number = Column(String(50), nullable= True, default = "")
    purchase_cost = Column(Float, nullable= False)
    warranty = Column(String(100), nullable= True, default =" ")
    note = Column(String, nullable= True, default= " ")
    default_location = Column(String, nullable= False)
    photo = Column(String(255), nullable= True, default="")
    actual_photo_name = Column(String(255), nullable= True, default= " ")
    is_on_repair = Column(Boolean, default=False)

    # Constructor
    def __init__(
        self,
        company,
        asset_name,
        tags,
        serial_number,
        model,
        status,
        purchase_date,
        supplier,
        order_number,
        purchase_cost,
        warranty,
        default_location,
        photo = "blank-img.jpg",
        actual_photo_name = "blank-img.jpg",
        note = " ",
        ):

        self.company = company
        self.asset_name = asset_name
        self.tags = tags
        self.serial_number = serial_number
        self.model = model
        self.status = status
        self.purchase_date = purchase_date
        self.supplier = supplier
        self.order_number = order_number
        self.purchase_cost = purchase_cost
        self.warranty = warranty
        self.note = note
        self.photo = photo
        self.actual_photo_name = actual_photo_name
        self.default_location = default_location



    def insert(self):
        # create a new asset
        db.session.add(self)
        db.session.commit()

    def update(self):
        # update existing asset
        db.session.commit()


    def delete(self):
        # delete an asset
        db.session.delete(self)
        db.session.commit()


    def format(self):
        # json format of 
        # asset data
        return {
            "asset_id": self.id,
            "company": self.company,
            "asset_name": self.asset_name,
            "asset_tag": self.tags,
            "asset_serial": self.serial_number,
            "asset_model": self.model,
            "asset_status": self.status,
            "supplier": self.supplier,
            "order_number": self.order_number,
            "purchase_cost": self.purchase_cost,
            "purchase_date": self.purchase_date.isoformat(),
            "note": self.note,
            "warranty": self.warranty,
            "photo": self.photo,
            "actual_photo_name": self.actual_photo_name,
            "default_location": self.default_location
            
            }


class License(db.Model):
    id = Column(Integer, primary_key = True)
    software_name = Column(Integer, nullable= False)
    category_name = Column(String(100), nullable= True, default= " ")
    product_key = Column(String, nullable= False)
    seats = Column(String(50), nullable= False)
    company = Column(String(100), nullable= True, default= " ")
    manufacturer = Column(String(100), nullable= True, default=" ")
    license_to_name = Column(String(100), nullable= False)
    license_to_email = Column(String(255), nullable= False)
    reassignable = Column(Boolean, nullable= False)
    supplier = Column(String(100), nullable= True, default=" ")
    order_number = Column(String(50), nullable= True, default = " ")
    purchase_cost = Column(Float, nullable= False)
    purchase_date = Column(Date, nullable= False)
    expiration_date = Column(Date, nullable= False)
    termination_date = Column(Date, nullable= True)
    purchase_order_number = Column(String(50), nullable= True, default= "")
    maintained = Column(Boolean, nullable= False)
    note = Column(String, nullable= True, default= " ")
    default_location = Column(String, nullable= False)
    


    # Constructor
    def __init__(
        self,
        software_name,
        category_name,
        product_key,
        seats,
        company,
        manufacturer,
        license_to_name,
        license_to_email,
        reassignable,
        supplier,
        order_number,
        purchase_cost,
        purchase_date,
        expiration_date,
        termination_date,
        purchase_order_number,
        maintained,
        default_location,
        note
        ):

        self.software_name = software_name
        self.category_name = category_name
        self.product_key = product_key
        self.seats = seats
        self.company = company
        self.manufacturer = manufacturer
        self.license_to_name = license_to_name
        self.license_to_email = license_to_email
        self.reassignable = reassignable
        self.supplier = supplier
        self.order_number = order_number
        self.purchase_cost = purchase_cost
        self.purchase_date = purchase_date
        self.expiration_date = expiration_date
        self.termination_date = termination_date
        self.purchase_order_number = purchase_order_number
        self.maintained = maintained
        self.note = note
        self.default_location = default_location


    def insert(self):
        # create new license
        db.session.add(self)
        db.session.commit()

    def update(self):
        # update existing license
        db.session.commit()


    def delete(self):
        # delete license
        db.session.delete(self)
        db.session.commit()


    
    def format(self):
        # json format of 
        # license data
        return {
            "license_id": self.id,
            "software_name": self.software_name,
            "category_name": self.category_name,
            "product_key": self.product_key,
            "seats": self.seats,
            "company": self.company,
            "manufacturer": self.manufacturer,
            "license_to_name": self.license_to_name,
            "license_to_email": self.license_to_email,
            "reassignable": self.reassignable,
            "supplier": self.supplier,
            "order_number": self.order_number,
            "purchase_cost": self.purchase_cost,
            "purchase_date": self.purchase_date.isoformat(),
            "expiration_date": self.expiration_date.isoformat(),
            "termination_date": self.termination_date.isoformat() if self.termination_date else "",
            "purchase_order_number": self.purchase_order_number,
            "maintained": self.maintained,
            "default_location": self.default_location,
            "note": self.note
        }






