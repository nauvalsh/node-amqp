# Restart / reload Nginx

`docker kill -s HUP nama_container`

# Get into image

`docker run -it nama_image sh`

# See logs from container

`docker container logs nama_container`

# AMQLIBS Docs

`https://www.squaremobius.net/amqp.node/channel_api.html`
`https://www.cloudamqp.com/blog/rabbitmq_delayed_message_exchange_plugin_with_node_js.html`
`https://www.cloudamqp.com/blog/part4-rabbitmq-for-beginners-exchanges-routing-keys-bindings.html`

# Docker VPS

`https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04`

`https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04`

`https://linuxconfig.org/command-make-not-found-on-ubuntu-20-04-focal-fossa`

## Update / Redeploy

1. Jika ada perubahan jalankan `docker-compose build`, perintah tersebut akan membuild image ulang
2. Jalankan `docker-compose up -d`, perintah tersebut akan recreating container jika ada perubahan pada image
