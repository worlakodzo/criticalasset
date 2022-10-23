from email.policy import default
from functools import wraps
import os
import sys
import uuid
from datetime import datetime
from flask import Flask, render_template, redirect, session, request, jsonify, abort,url_for
from models import (
    setup_db,
    create_db,
    Asset,
    License,
    User,

    STATUS_LIST,
    COMPANY_LIST,
    SUPPLIER_LIST,
    CATEGORY_LIST,
    MANUFACTURER_LIST
    )



UPLOAD_FOLDER =  os.path.join('static', 'assetmgmt/images')
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])



# Database credentials
DB_PASSWORD = "assetPASS"
DB_NAME = "assetmgmt"
DB_HOST = "localhost:3306"
DB_USER = "admin"

# DB_CONNECTION_STRING = f"mysql+mysqldb://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
DB_CONNECTION_STRING = "sqlite:////media/worlako/MAC OSX/workhub/ticketboox/assetmgmt/assetmgmt.db"

# create flask application
app = Flask(__name__)

# configure the file upload folder
# and application security setting
app.config['SECRET_KEY'] = 'I-will-change-the-Secret-Code-Later'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# setup database connection
db = setup_db(app, DB_CONNECTION_STRING)


# Create all database
# tables
create_db()


def upload_img(file):

    file_path = ""
    actual_filename = ""
    new_filename = ""
    try:

        # Get file extension
        file_extension = file.filename.split(".")[1].lower().strip()


        # Get storage path
        root_path = UPLOAD_FOLDER

        actual_filename = file.filename

        # Build file path
        root_path = root_path.replace("\\", "/")
        new_filename = build_file_name(file_extension, "img")
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)

        # Save file
        file.save(file_path)


        # PERMIT READ FILE
        try:
            os.chmod(file_path, 0o777)
        except Exception as e:
            print(str(e))
        # END PERMIT READ FILE


    except Exception as e:
        print(str(e))
        return {
                "filename": "blank-img.jpg",
                "actual_filename": "blank-img.jpg",
            }

    else:
        return {
                "filename": new_filename,
                "actual_filename": actual_filename,
            }


def build_file_name(file_extension, prefix):
    new_filename = f'{prefix}_{uuid.uuid4()}_{datetime.now().strftime("%d%m%y%I%M%S")}.{file_extension}'
    new_filename = new_filename.replace("-", "_")
    return new_filename



@app.route('/display/<filename>')
def display_image(filename):
	#print('display_image filename: ' + filename)
	return redirect(url_for('static', filename='uploads/' + filename), code=301)

# Decorators
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return redirect('/login')

    return wrap




@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')


@app.route('/login', methods=['POST', 'GET'])
def login():
    if 'logged_in' in session:
        return redirect('/')
    if request.method == 'POST':

        username = request.form.get("username", "")
        password = request.form.get("password", "")
        print("username: ", username)

        # Retrive user
        user = User.query.filter(User.username == username).one_or_none()

        try:
            # verify user account 
            if user and User.verify_user(user, password):

                # check if user
                # has permission to login
                if user.is_active:
                    # give user access
                    session['logged_in'] = True
                    session['user'] = user.format()
                    return redirect('/')

                else:
                    # prompt user to contact adminstractor
                    error_message = """<p class="text-danger">Contact adminstractor for login access</p>"""
                    return render_template('login.html', error_message=error_message)


            else:
                # prompt user for login error
                error_message = """<p class="text-danger">Wrong Password or username</p>"""
                return render_template('login.html', error_message=error_message)

        except:
            for error in sys.exc_info():
                print("Oops!", error, "occurred.")
            return render_template('login.html')
    else:
        return render_template('login.html')


@app.route("/", methods=["GET", "POST"])
@login_required
def dashboard():
    return render_template("dashboard.html")



@app.route('/users')
def users_list():
    try:
        # Retrieve all user from database
        user_query = User.query.all()

        # loop over all user object 
        # and format the data
        users = [user.format() for user in user_query]
        return render_template("users_list.html", users= users)

    # The code below will 
    # execute when error occur
    # in the try block
    except Exception as err:
        # print out err to 
        # console for debug purpose
        print(str(err))

        # call to error handler
        abort(500)


@app.route('/user_add', methods=["GET", "POST"])
def create_user():
    try:

        if request.method == "GET":

            return render_template("users_add.html")


        # convert data submited from 
        # the frontend into json
        body = request.get_json()

        # Create new user object
        hash_password = User.get_hashed_password(body['password'])
        user = User(
            username= body["username"],
            password= hash_password,
            is_active= True,
            is_admin= bool(int(body["is_admin"]))
        )

        # insert the new user
        # into the database
        user.insert()

        # return json data
        return jsonify({
            "success": True
        }), 201
    

    # The code below will 
    # execute when error occur
    # in the try block
    except Exception as err:
        # print out err to 
        # console for debug purpose
        print(str(err))

        # call to error handler
        abort(500)


@app.route('/user_edit/<int:user_id>', methods=["GET", "POST"])
def update_user(user_id):
    try:
        
        if request.method == "GET":
            user = User.query.get(user_id)
            return render_template("user_edit.html", user=user.format())



        # convert data submited from 
        # the frontend into json
        body = request.get_json()

        # Retrive user from database
        user = User.query.get(user_id)

        # Edit user data
        user.is_active = bool(int(body['is_active']))
        user.is_admin = bool(int(body['is_admin']))

        # commit changes to database
        user.update()

        # return json data
        return jsonify({
            "success": True
        })
    

    # The code below will 
    # execute when error occur
    # in the try block
    except Exception as err:
        # print out err to 
        # console for debug purpose
        print(str(err))

        # call to error handler
        abort(500)

@app.route('/change_password/<int:user_id>', methods=["GET", "POST"])
def change_password(user_id):
    try:

        if request.method == "GET":
            user = User.query.get(user_id)
            return render_template("change_password.html", user=user.format())


        # convert data submited from 
        # the frontend into json
        body = request.get_json()

        # Retrive user from database
        user = User.query.get(user_id)

        # Edit password
        hash_password = User.get_hashed_password(body['password'])
        user.password = hash_password

        # commit changes to database
        user.update()

        # return json data
        return jsonify({
            "success": True
        })
    

    # The code below will 
    # execute when error occur
    # in the try block
    except Exception as err:
        # print out err to 
        # console for debug purpose
        print(str(err))

        # call to error handler
        abort(500)


@app.route("/user_delete/<int:user_id>", methods=["GET"])
def delete_user(user_id):
    try:
        # get user
        user = User.query.get(user_id)
        # delete user
        user.delete()
        
        return jsonify({
            "success": True
        })
    except Exception as e:
        print(str(e))
        abort(500)


@app.route("/assets", methods=["GET"])
def asset_list():
    try:
        # Retrieve all asset from database
        asset_query = Asset.query.all()
        assets = []

        # loop over all asset object 
        # and format the data
        for asset in asset_query:
            data = asset.format()

            # get link of asset image
            photo_link = os.path.join(app.config['UPLOAD_FOLDER'], asset.photo)
            data['photo_link'] = f"/{photo_link}"


            # add data to list of asset
            assets.append(data)

        return render_template("asset_list.html", assets= assets)

    # The code below will 
    # execute when error occur
    # in the try block
    except Exception as err:
        # print out err to 
        # console for debug purpose
        print(str(err))

        # call to error handler
        abort(500)



@app.route("/asset_add", methods=["GET", "POST"])
def asset_add():
    try:

        if request.method == "GET":
            return render_template("asset_add.html", status_list= STATUS_LIST)


        # get data submited from 
        # the frontend as dictionary object
        body = request.form
        photo = ""
        actual_photo_name = ""
        file_data = {}

        # save image
        default_image = "blank-img.jpg"
        if "upload_asset_image" in request.files:
            file = request.files['upload_asset_image']
            file_data = upload_img(file)

        # set default image
        # if image if not uploaded
        if file_data:
            photo= file_data['filename']
            actual_photo_name = file_data['actual_filename']
        else:
            photo= default_image
            actual_photo_name = default_image

        print("working")
        # Create new asset object
        asset = Asset(
            company= body["company"],
            asset_name= body["asset_name"],
            tags= body["asset_tag"],
            serial_number= body["asset_serial"],
            model= body["asset_model"],
            status= body["asset_status"],
            purchase_date= datetime.fromisoformat(body["purchase_date"]),
            supplier= body["supplier"],
            order_number= body["order_number"],
            purchase_cost= body["purchase_cost"],
            warranty= body["warranty"],
            note= body["note"],
            default_location= body["default_location"],
            photo= photo,
            actual_photo_name = actual_photo_name
            )

        # insert the new asset
        # into the database
        asset.insert()

        # return json data
        return jsonify({
            "success": True
        }), 201
    

    # The code below will 
    # execute when error occur
    # in the try block
    except Exception as err:
        # print out err to 
        # console for debug purpose
        print(str(err))

        # call to error handler
        abort(500)


@app.route("/asset_edit/<int:asset_id>", methods=["GET", "POST"])
def asset_edit(asset_id):
    try:

        if request.method == "GET":
            return render_template(
                "asset_edit.html",
                asset_id=asset_id,
                status_list= STATUS_LIST)


        # get data submited from 
        # the frontend as dictionary object
        body = request.form

        # save image
        file_data = {}
        if "upload_asset_image" in request.files:
            file = request.files['upload_asset_image']
            file_data = upload_img(file)

        # Get asset
        asset = Asset.query.get(asset_id)

        # update asset object
        asset.company= body["company"]
        asset.asset_name= body["asset_name"]
        asset.tags= body["asset_tag"]
        asset.serial_number= body["asset_serial"]
        asset.model= body["asset_model"]
        asset.status= body["asset_status"]
        asset.purchase_date= datetime.fromisoformat(body["purchase_date"])
        asset.supplier= body["supplier"]
        asset.order_number= body["order_number"]
        asset.purchase_cost= body["purchase_cost"]
        asset.warranty= body["warranty"]
        asset.note= body["note"]
        asset.default_location= body["default_location"]

        # update photo attribute
        # when new asset image is
        # loaded
        if file_data:
            if "filename" in file_data:
                asset.photo= file_data['filename']
                asset.actual_photo_name = file_data['actual_filename']
        

        # commit asset
        # into the database
        asset.update()

        # return json data
        return jsonify({
            "success": True
        }), 200
    

    # The code below will 
    # execute when error occur
    # in the try block
    except Exception as err:
        # print out err to 
        # console for debug purpose
        print(str(err))

        # call to error handler
        abort(500)



@app.route('/asset_load/<int:asset_id>')
def load_asset(asset_id):
    try:
        asset = Asset.query.get(asset_id)
        data = asset.format()

        # get link of asset image
        photo_link = os.path.join(app.config['UPLOAD_FOLDER'], asset.photo)
        data['photo_link'] = f"/{photo_link}"
        
        return jsonify({
            "asset": data
        })
    except Exception as e:
        print(str(e))
        abort(500)



@app.route("/asset_delete/<int:asset_id>", methods=["GET"])
def asset_delete(asset_id):
    try:
        # get asset
        asset = Asset.query.get(asset_id)
        # delete asset
        asset.delete()
        
        return jsonify({
            "success": True
        })
    except Exception as e:
        print(str(e))
        abort(500)


@app.route("/licenses", methods=["GET"])
def license_list():
    try:
        # Retrieve all license from database
        license_query = License.query.all()
        licenses = []

        # loop over all license object 
        # and format the data
        for license in license_query:
            # add license to list of licenses
            licenses.append(license.format())

        return render_template("license_list.html", licenses= licenses)

    # The code below will 
    # execute when error occur
    # in the try block
    except Exception as err:
        # print out err to 
        # console for debug purpose
        print(str(err))

        # call to error handler
        abort(500)




@app.route("/license_add", methods=["GET", "POST"])
def license_add():
    try:

        if request.method == "GET":
            return render_template(
                "license_add.html",
                supplier_list=SUPPLIER_LIST,
                company_list=COMPANY_LIST,
                category_list=CATEGORY_LIST,
                manufacturer_list=MANUFACTURER_LIST
                )


        # get data submited from 
        # the frontend as dictionary object
        body = request.form

        # Create new license object
        license = License(
            software_name= body["software_name"],
            category_name= body["category_name"],
            product_key= body["product_key"],
            seats= body["seats"],
            company= body["company"],
            manufacturer= body["manufacturer"],
            license_to_name= body["license_to_name"],
            license_to_email= body["license_to_email"],
            supplier= body["supplier"],
            order_number= body["order_number"],
            purchase_cost= body["purchase_cost"],
            purchase_date= datetime.fromisoformat(body["purchase_date"]),
            expiration_date= datetime.fromisoformat(body["expiration_date"]),
            termination_date= datetime.fromisoformat(body["termination_date"]),
            note= body["note"],
            purchase_order_number= body["purchase_order_number"],
            reassignable= False,
            maintained= False
            )

        # insert the new license
        # into the database
        license.insert()

        # return json data
        return jsonify({
            "success": True
        }), 201
    

    # The code below will 
    # execute when error occur
    # in the try block
    except Exception as err:
        # print out err to 
        # console for debug purpose
        print(str(err))

        # call to error handler
        abort(500)



@app.route("/license_edit/<int:license_id>", methods=["GET", "POST"])
def license_edit(license_id):
    try:

        if request.method == "GET":
            return render_template(
                "license_edit.html",
                license_id= license_id,
                supplier_list=SUPPLIER_LIST,
                company_list=COMPANY_LIST,
                category_list=CATEGORY_LIST,
                manufacturer_list=MANUFACTURER_LIST
                )


        # get data submited from 
        # the frontend as dictionary object
        body = request.form

        # get license 
        license = License.query.get(license_id)

        license.software_name= body["software_name"]
        license.category_name= body["category_name"]
        license.product_key= body["product_key"]
        license.seats= body["seats"]
        license.company= body["company"]
        license.manufacturer= body["manufacturer"]
        license.license_to_name= body["license_to_name"]
        license.license_to_email= body["license_to_email"]
        license.supplier= body["supplier"]
        license.order_number= body["order_number"]
        license.purchase_cost= body["purchase_cost"]
        license.purchase_date= datetime.fromisoformat(body["purchase_date"])
        license.expiration_date= datetime.fromisoformat(body["expiration_date"])
        license.termination_date= datetime.fromisoformat(body["termination_date"])
        license.note= body["note"]
        license.purchase_order_number= body["purchase_order_number"]
            

        # commit license
        # into the database
        license.insert()

        # return json data
        return jsonify({
            "success": True
        }), 200
    

    # The code below will 
    # execute when error occur
    # in the try block
    except Exception as err:
        # print out err to 
        # console for debug purpose
        print(str(err))

        # call to error handler
        abort(500)

@app.route('/license_load/<int:license_id>')
def load_license(license_id):
    try:
        # get license
        license = License.query.get(license_id)
        
        return jsonify({
            "license": license.format()
        })
    except Exception as e:
        print(str(e))
        abort(500)


@app.route("/license_delete/<int:license_id>", methods=["GET"])
def license_delete(license_id):
    try:
        # get license
        license = License.query.get(license_id)
        # delete license
        license.delete()
        
        return jsonify({
            "success": True
        })
    except Exception as e:
        print(str(e))
        abort(500)



"""
Error handle
"""

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({
        "success": False,
        "error": 500,
        "message": "Internal Server Error"
    }), 500


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "success": False,
        "error": 405,
        "message": "Method Not Allowed"
    }), 405

@app.errorhandler(404)
def resource_not_found(error):
    return jsonify({
        "success": False,
        "error": 404,
        "message": "Resource Not Found"
    }), 404

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({
        "success": False,
        "error": 401,
        "message": "Unauthorized"
    }), 401