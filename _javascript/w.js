login as
:
root
root
@188.68
.210
.217
's password:
Welcome
to
Ubuntu
16.04
.5
LTS(GNU / Linux
4.4
.0 - 142 - generic
x86_64
)

*
Documentation:  https://help.ubuntu.com
    *
Management:     https://landscape.canonical.com
    *
Support:        https://ubuntu.com/advantage
    New
release
'18.04.2 LTS'
available.Run
'do-release-upgrade'
to
upgrade
to
it.Last
login: Mon
Mar
18
0
9
:
52
:
55
2019
from
176.59
.96
.202
root
@cs520953:
~# certbot--
manual
Saving
debug
log
to /
var /log/
letsencrypt / letsencrypt.log
With
the
manual
plugin, you
probably
want
to
use
the
"certonly"
command, eg
:

certbot
certonly--
manual

(Alternatively, add
a--
installer
flag.See
https://eff.org/letsencrypt-plugins
    and
"--help plugins"
for more information.
)
root
@cs520953:
~# certbot
certonly - manual
Saving
debug
log
to /
var /log/
letsencrypt / letsencrypt.log

How
would
you
like
to
authenticate
with the ACME
CA ?
    ----------------------------------------
        1 : Spin
up
a
temporary
webserver(standalone)
2
:
Place
files in webroot
directory(webroot)
- ---------------------------------------
    Select
the
appropriate
number [1 - 2]
then [enter](press
'c'
to
cancel
):
c
Could
not
choose
appropriate
plugin: authenticator
could
not
be
determined
or
is
not
installed
authenticator
could
not
be
determined
or
is
not
installed
root
@cs520953:
~# certbot
certonly--
manual
Saving
debug
log
to /
var /log/
letsencrypt / letsencrypt.log
Plugins
selected: Authenticator
manual, Installer
None
Starting
new HTTPS
connection(1)
:
acme - v02.api.letsencrypt.org
Please
enter in your
domain
name(s)(comma
and / or
space
separated
)
(Enter
'c'
to
cancel
):
lenfincentr.ru
Obtaining
a
new certificate
Performing
the
following
challenges:
    http - 01
challenge
for lenfincentr.ru

    - ---------------------------------------
    NOTE:
The
IP
of
this
machine
will
be
publicly
logged as having
requested
this
certificate.If
you
're running certbot in manual mode on a machine that is not
your
server, please
ensure
you
're okay with that.

Are
you
OK
with your IP
being
logged ?
    ----------------------------------------
        (Y)es / (N)
o: y

- ---------------------------------------
    Create
a
file
containing
just
this
data:

    cfKlTPsy_OZUVc - LTRySFnqPA58cbm - RmPm_7rTU0Mk.xMJ2AY92bIOEjIo0glVCGLNj7UWktemsnm2TbSqKIpA

And
make
it
available
on
your
web
server
at
this
URL:

    http://lenfincentr.ru/.well-known/acme-challenge/cfKlTPsy_OZUVc-LTRySFnqPA58cbm-RmPm_7rTU0Mk

        ----------------------------------------
            Press
Enter
to
Continue
