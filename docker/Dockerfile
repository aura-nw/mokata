FROM rust:latest

# install go
WORKDIR /
RUN wget https://go.dev/dl/go1.18.4.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf go1.18.4.linux-amd64.tar.gz 
RUN rm go1.18.4.linux-amd64.tar.gz
ENV PATH /usr/local/go/bin:$PATH

# init, build and start the blockchain
WORKDIR /
RUN git clone -b dev_70c5915 https://github.com/aura-nw/aura.git
WORKDIR /aura
RUN go mod download
RUN curl https://get.ignite.com/cli! | bash
RUN ignite chain init && ignite chain build
RUN sed -ri 's/^(\s*)(minimum-gas-prices\s*:\s*"0.0001uaura"\s*$)/\1minimum-gas-prices: "0uaura"/' config.yml

CMD ignite chain serve
