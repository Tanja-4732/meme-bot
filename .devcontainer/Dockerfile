
FROM node:10

# Install the dependencies
RUN npm install

# Verify git and process tools are installed
RUN apt-get install -y git procps

# ENV [set them here from the host]

# Set the default shell to bash rather than sh
ENV SHELL /bin/bash