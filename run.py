from app import create_app, db
from flask_migrate import Migrate
import os
app = create_app()
migrate = Migrate(app, db)  # ← ESSA LINHA É ESSENCIAL!


if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG", "false").lower() == "true")
