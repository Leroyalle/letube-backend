export interface BrokerEventBusPort {
  emit(event: string, payload: unknown): void;
}
