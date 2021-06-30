## **连接配置帮助**
### **1. MQ配置说明**
请遵循以下说明以确保在 Tapdata 中成功添加和使用MQ数据源，包括AcitveMQ、RabbitMQ、RocketMQ。

### **2. 限制说明**
Tapdata系统支持 MQ作为源和目标。

### **3. 支持版本**
activemq-5.14.x、 rabbitmq-3.8.x、 rocketmq-4.9.x

### **4. 配置说明**
#### **数据源配置**<br>
- MQ类型，可以选择ActiveMQ、RabbitMQ、RocketMQ
- 连接类型，支持为源和目标、源头、目标
- 主题名称，允许为空
- 账号，允许为空
- 密码，允许为空

#### **RocketMQ专用配置**<br>
- MQ地址，端口

#### **RocketMQ专用配置**<br>
- 队列名称：可以为空
- MQ连接串：必填项

#### **RocketMQ专用配置**<br>
- 消息路由：允许为空
- 虚拟主机：允许为空

### **5. 连接测试项**
- 所有标记为必填项的字段内容
