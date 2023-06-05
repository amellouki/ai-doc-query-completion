export class ConvoRetrievalQaRequestDto {
  history: HistoryItem[];
  question: string;
}

export class HistoryItem {
  type: string;
  content: string;
}
