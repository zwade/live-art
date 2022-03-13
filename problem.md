# Live Art

- namespace: picoctf/picoctf2022
- type: custom
- category: Web Security
- points: 500

## Description

There's nothing quite as fun as drawing for an audience. So sign up for LiveArt
today and show the world what you can do.

### Infrastructure Notes

 - When writing your exploit, please have the script target `http://localhost:4000`. Trying to access the page using the same origin as you're using will load but **will not have the flag**
 - The container is only allowed to make outbound connections on ports `80` and `443`. If you try to host your exploit on a different port, it will fail silently.

## Details

Site: {{link_as("/", "Live Art")}}

Bundle: {{url_for("bundle.tar.gz", "here")}}

## Hints

- The flag will be the admin's username/broadcast link, at the origin `http://localhost:4000/`
- https://html.spec.whatwg.org/multipage/custom-elements.html

## Solution

(Omitted to avoid spoiling testers. Ping me at zwad3#2214 on discord or @zwad3
on twitter for the details)

## Learning Objective

(Omitted for the same reason. Vaguely: Reading and understanding client-side
code)

## Attributes

- author: zwad3
- organization: picoCTF
- event: picoCTF 2022
