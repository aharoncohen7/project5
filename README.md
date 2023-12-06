# project5
Installation


פרוייקט גמר פרק 5

הפרוייקט מדמה רשת חברתית המציגה פוסטים של המשתמשים, אלבומי תמונות, וTodos.

לאתר יש 10 users שכבר רשומים והמידע לגבם מצוי בקובץ db.json המצורף בתיקייה הראשית.

על מנת להכנס לאתר יש לבצע כניסה באמצעות השדות username +  website של אחד המשתמשים המופיעים בתוך "users" שבתוך db.json.

פרטי הכניסה נרשמים באחסון המקומי של הדפדפן ונמחקים בעת הלחיצה על כפתור היציאה + מניעעת אפשרות לחזור אחורה בדפדפן.

ניתן לראות את הפוסטים של כלל המשתמשים, אך את התמונות וTodos רק של המתשמש עצמו.

ניתן לערוך/למחוק/להוסיף פוסטים, תמונות, וTodos של המשתמש עצמו.

באלבומים יש לבחור באלבום מסוים כדי לראות את התמונות שלו. התמונות נטענות במנות של 5 תמונות ולחיצה על כפתור טוענת 5 תמונות נוספות.

בפוסטים ניתן להוסיף תגובות לפוסטים מתוך מאגר תגובות שמקושר לכל פוסט מסויים שקיים בקובץ db.json.




========================================================
הוראות התקנה:
כדי שהאתר יעבוד כראוי ש צורך להריץ את הקובץ db.json על פורט 3100 באמצעות הפקודה הבאה:
json-server --watch db.json --port 3100

כמו"כ יש צורך להתקין את 2 הספריות:
react-router-dom,  sweetalert2

באמצעות הפקודות:
npm install react-router-dom
npm install sweetalert2