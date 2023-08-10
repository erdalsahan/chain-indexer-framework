import { AsynchronousDataTransformer } from "./asynchronous_data_transformer.js";
import { SynchronousDataTransformer } from "./synchronous_data_transformer.js";
import { ITransformerConfig } from "@internal/interfaces/transformer_config.js";
import { IEventTransformer } from "@internal/interfaces/event_transformer.js";
import { KafkaError } from "@internal/errors/kafka_error.js";

/**
 * Function to be used as functional implementation for the transformer classes for asynchronous
 * and synchronous data trasnformer. this function will creates the class and then start transforming the events.
 * transform function needs to be passed.
 * 
 * @param {ITransformerConfig} config - consumer config
 * @param {IEventTransformer<T, G, KafkaError>} eventTransformer - event transformer containing and transform and error function
 *  
 * @returns {AsynchronousDataTransformer<T, G> | SynchronousDataTransformer<T, G>}
 */
export function transform<T, G>(
    config: ITransformerConfig, eventTransformer: IEventTransformer<T, G, KafkaError>
): AsynchronousDataTransformer<T, G> | SynchronousDataTransformer<T, G> {
    const type = config.type;
    const consumerConfig = config.consumerConfig;
    const producerConfig = config.producerConfig;

    let transformer: AsynchronousDataTransformer<T, G> | SynchronousDataTransformer<T, G> | null = null;

    if (type === "asynchronous") {
        //@ts-ignore
        transformer = new AsynchronousDataTransformer<T, G>(consumerConfig, producerConfig);
    }

    if (type === "synchronous") {
        //@ts-ignore
        transformer = new SynchronousDataTransformer<T, G>(consumerConfig, producerConfig);
    }

    if (!transformer) {
        throw new Error("Invalid type");
    }

    //@ts-ignore
    transformer.transform = eventTransformer.transform;

    transformer.on("dataTransformer.fatalError", eventTransformer.error);

    transformer.start();

    return transformer;

}
