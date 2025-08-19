
Planiranje ishrane

Aplikacija koja pruza mogucnost kreiranja recepata i sastojaka, kreiranje personalizovanih planova obroka uz automatsko generisanje liste za kupovinu, i jos mnogo toga.

Uputstvo za preuzimanje projekta:

# Kloniranje projekta i neophodne postavke
 
- Klonirati repozitorijum komandom git clone https://github.com/elab-development/internet-tehnologije-2024-projekat-planiranje_ishrane.git na željenu destinaciju na vašem računaru
- U željenom tekstualnom editoru otvoriti klonirani projekat (preporuka VSCode)
 
# Pokretanje Laravel API-ja
 
- Pozicionirati se u back folder komandom `cd back`
- Instalirati composer komandom `composer install`
- Kreirati .env fajl u root-u back projekta i podesiti informacije o konekciji sa bazom: DB_PORT, DB_USERNAME, DB_PASSWORD, DB_HOST
- Popuniti bazu podacima komandom `php artisan migrate:fresh --seed`
- Pokrenuti aplikaciju komandom `php artisan serve`
 
# Pokretanje React domaceg
 
- Pozicionirati se u front_domaci folder komandom `cd front_domaci` (Neophodno je prvo pozicionirati se u root direktorijum komandom `cd ..`)
- Komandom `npm install` ( ili `npm i`), instalirati neophodne pakete za pokretanje same aplikacije
- Pokrenuti aplikaciju komandom `npm start`

# Pokretanje React projekta povezanog sa laravelom
 
- Pozicionirati se u front_domaci folder komandom `cd front_projekat` (Neophodno je prvo pozicionirati se u root direktorijum komandom `cd ..`)
- Komandom `npm install` ( ili `npm i`), instalirati neophodne pakete za pokretanje same aplikacije
- Pokrenuti aplikaciju komandom `npm start`
