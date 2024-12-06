# 使用官方 Ubuntu 镜像
FROM ubuntu:20.04

# 设置环境变量以防止交互式提示
ENV DEBIAN_FRONTEND=noninteractive
ENV JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
ENV PATH="$JAVA_HOME/bin:$PATH"

# 更新包管理器并安装基础工具
RUN apt-get update && \
    apt-get install -y sudo curl wget git vim zip unzip apt-transport-https ca-certificates gnupg lsb-release && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    echo "基础工具安装完成"

# 安装 Java 17
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk && \
    echo "Java 安装完成，JAVA_HOME 已设置为 $JAVA_HOME"

# 安装 Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash - && \
    apt-get install -y nodejs && \
    node -v && npm -v && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    echo "Node.js 安装完成"

# 安装 SDKMAN
RUN curl -s "https://get.sdkman.io" | bash && \
    bash -c "source /root/.sdkman/bin/sdkman-init.sh && sdk version" && \
    echo "SDKMAN 安装完成"

# 安装 Maven
RUN apt-get update && \
    apt-get install -y maven && \
    mvn -v && \
    echo "Maven 安装完成"
RUN git config --global --add safe.directory /workspaces/creditCard
    # RUN git config --global user.name "DaoC-del" && \
    # git config --global user.email "550164003@qq.com" && \
    # echo "Git 用户信息配置完成"
# 设置工作目录
WORKDIR /workspace

# 添加初始化 SDKMAN 到 profile
RUN echo "source /root/.sdkman/bin/sdkman-init.sh" >> /root/.bashrc

# 输出完成信息
RUN echo "所有工具安装完成"