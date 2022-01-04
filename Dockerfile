from ubuntu:20.04 as prebuild

WORKDIR /root
COPY ./sources.list /etc/apt/sources.list

RUN apt update \
    && apt install wget xz-utils -y \
    && wget https://nodejs.org/download/release/v14.18.2/node-v14.18.2-linux-x64.tar.xz \
    && tar -xvJf node-v14.18.2-linux-x64.tar.xz \
    && find node-v14.18.2-linux-x64/ -depth -maxdepth 1 -type f | xargs rm -f

from ubuntu:20.04 as app

ENV APP_PATH=/root/ilikeit \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

WORKDIR ${APP_PATH}
COPY . .
COPY ./sources.list /etc/apt/sources.list
COPY --from=prebuild /root/node-v14.18.2-linux-x64 /usr/local

RUN apt update \
    && apt install -y \
    libxrender1 \
    libfontconfig1 \
    libxext6 \
    fonts-noto-core \
    fonts-noto-cjk \
    locales \
    && apt autoremove -y \
    && apt clean \
    && rm -rf /var/lib/apt/lists/*

COPY ./locale.gen /etc/locale.gen

RUN locale-gen \
    && npm install -g pnpm \
    && pnpm i --production \
    && chmod +x bin/wkhtmltopdf

VOLUME ${APP_PATH}/data
EXPOSE 3000
CMD ["node", "."]
