# url_shortener

FreeCodeCamp API Basejump: URL Shortener Microservice

To see a working example go to:  https://mysterious-savannah-41175.herokuapp.com/

Pass a URL as a parameter and you will receive a shortened URL in the JSON response.
When I visit that shortened URL, it will redirect me to my original link.
Example creation usage:

https://mysterious-savannah-41175.herokuapp.com/new/https://www.google.com
https://mysterious-savannah-41175.herokuapp.com/new/http://foo.com:80
Example creation output:

{ "original_url":"http://foo.com:80", "short_url":"https://mysterious-savannah-41175.herokuapp.com/SJzqX8Vr" }
Usage:

mysterious-savannah-41175.herokuapp.com/SkCoMI4H
Will redirect to:

https://www.google.com/
