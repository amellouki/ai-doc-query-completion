export class ConvoRetrievalQaRequestDto {
  history: HistoryItem[];
  question: string;
}

export class HistoryItem {
  id: number;
  fromType: string;
  type: string;
  content: string;
  from: Source;
}

export class AppendHistoryDto {
  conversationId: number;
  historyItem: Omit<HistoryItem, 'from'> & { fromId: number };
}

export class Source {
  id: number;
}

export class Human extends Source {
  name: string;
}

export class LanguageModel extends Source {
  name: string;
}
