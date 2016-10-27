# Announcement-tbot
NodeJS telegram bot to send you new announcements in some announcement portals

## How to use it
1. Create a new chat with [@jualopver_bot](http://telegram.me/jualopver_bot)
2. Go to one of the announcement supported portals and make a search about what do you want to find
3. Copy the url of the search and add it to track with __/add_url__ command

    ```
    /add_url http://www.milanuncios.com/venta-de-chalets-en-madrid-madrid/?hasta=500000&dormd=4&m2d=70
    ```
    
4. The bot will respond with `Added!` message
5. Once that a new announcement appear in your search you will receive a new telegram message with the URL of the new announcements

To show all your added URLs you can run the __/show_db__ command

  ```
  /show_db
  ```

To delete an added URL you can remove it easily with the __/remove_url__ command

  ```
  /remove_url http://www.milanuncios.com/venta-de-chalets-en-madrid-madrid/?hasta=500000&dormd=4&m2d=70
  ```

## Supported portals
* www.milanuncios.com
* www.fotocasa.es
* www.idealista.com

Enjoy
