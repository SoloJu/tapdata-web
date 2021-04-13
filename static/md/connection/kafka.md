## **连接配置说明**

### **1. KAFKA 安装说明**
请遵循以下说明以确保在 Tapdata 中成功添加和使用 Kafka 数据库。

### **2. 使用限制**
> - 仅支持 JSON Object 字符串的消息格式 (如 `{"id":1, "name": "张三"}`)
> - 提前创建好主题
> - kafka 版本 2.3.x
> - 如果选择忽略消费或推送异常, 则仍然会记录这些消息的`offset`, 即是后续不会推送这些消息，存在数据丢失风险
> - 消息推送实现为 `At least once` ,   对应的消费端要做好幂等操作

#### **2.1 同步模式**

##### **仅全量**
> 该模式下 Source 会从主题的各个分区 `earliest offset` 开始订阅消费。 如果之前存在消息消费记录，则会恢复到之前的 `offset` 开始消费

##### **仅增量**
> 该模式下 Source 会从主题的各个分区 `latest offset` 开始订阅消费。 如果之前存在消息消费记录，则会恢复到之前的 `offset` 开始消费

##### **全量 + 增量**
> 该模式下 Source 会跳过全量同步阶段，从增量阶段开始。
> 1. 如果没有进行过全量同步，则会从主题的各个分区 `earliest offset` 开始订阅消费
> 2. 否则从主题的各个分区 `latest offset` 开始订阅消费。
> 3. 如果之前存在消息消费记录，则会恢复到之前的 `offset` 开始消费

#### **2.2 节点连接**
| source        | target        | 是否可链接 |
| ------------- | ------------- | ---------- |
| kafka         | elasticsearch | 是         |
| kafka         | redis         | 是         |
| kafka         | table         | 是         |
| kafka         | collection    | 是         |
| kafka         | memory        | 是         |
| elasticsearch | kafka         | 是         |
| table         | kafka         | 是         |
| redis         | kafka         | 是         |
| collection    | kafka         | 是         |
| memory        | kafka         | 是         |



##### **2.3 数据迁移**
| source     | target     | 是否可链接 |
| ---------- | ---------- | ---------- |
| kafka      | mysql      | 是         |
| kafka      | oracle     | 是         |
| kafka      | mongodb    | 是         |
| kafka      | db2        | 是         |
| kafka      | postgres   | 是         |
| kafka      | mssql      | 是         |
| kafka      | Base 8s    | 是         |
| kafka      | Sybase ASE | 是         |
| mysql      | kafka      | 是         |
| oracle     | kafka      | 是         |
| mongodb    | kafka      | 是         |
| db2        | kafka      | 是         |
| postgres   | kafka      | 是         |
| Sybase ASE | kafka      | 是         |
| Base 8s    | kafka      | 是         |
| mssql      | kafka      | 是         |


### **3. 配置**

##### **3.1 公共配置**
| 字段名 (UI表单参数名) | 类型   | 是否必填 | 备注                | 默认值 | 校验                                                         |
| --------------------- | ------ | -------- | ------------------- | ------ | ------------------------------------------------------------ |
| kafkaBootstrapServers | String | 是       | Borker地址列表      | -      | host1:port,host2:port,host3:port (如 192.168.1.1:9092,192.168.1.2:9092,192.168.1.3:9092) |
| databaseType          | String | 是       | 数据库类型          | -      | 固定值: kafka
| connection_type       | String | 是       | 链接类型            | -      | 枚举值: source \| target \| source_and_target
| kafkaPatternTopics    | String | 是       | 主题名称正则表达式, | -      | 文本长度大于0，小于256                                       |


##### **3.2 Source (Kafka Consumer)**
| 字段名 (UI表单参数名)    | 类型    | 是否必填 | 备注                                                         | 默认值 | 校验                  |
| ------------------------ | ------- | -------- | ------------------------------------------------------------ | ------ | --------------------- |
| kafkaIgnoreInvalidRecord | Boolean | 否       | 是否忽略非JSON Object格式消息,   如果是则遇到解析异常会忽略该消息，否则停止拉取消息 | false  | 枚举值: true \| false |

##### **3.3 Target (Kafka Producer)**
| 字段名 (UI表单参数名) | 类型    | 是否必填 | 备注                                                         | 默认值 | 校验                                          |
| --------------------- | ------- | -------- | ------------------------------------------------------------ | ------ | --------------------------------------------- |
| kafkaAcks             | String  | 否       | ACK确认机制， "0": 不确认, "1": 仅写入master分区, "-1":  写入大多数ISR分区, "all": 写入所有ISR分区 | -1     | 枚举值: "0" \| "1" \| "-1" \| "all"           | 
| kafkaCompressionType  | String  | 否       | 消息压缩类型:  gzip, snappy, lz4, zstd. 大流量消息开启压缩可以提高传输效率. | -      | 枚举值: "gzip" \| "snappy" \| "lz4" \| "zstd" |
| kafkaIgnorePushError  | Boolean | 否       | 是否忽略推送消息异常,  如果是则忽略该次推送的消息 (存在消息丢失)，否则停止推送消息 | false  | 枚举值: true \| false


