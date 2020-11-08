import path from 'path';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import loadCSV from '../utils/loadCSV';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.diretory, filename);
    const csvLines = await loadCSV(csvFilePath);
    const promises = csvLines.map(async line => {
      const [title, type, textValue, category] = line.split(',');
      const createTransaction = new CreateTransactionService();
      const transaction = createTransaction.execute({
        title,
        value: Number(textValue),
        type: type as 'income' | 'outcome',
        categoryName: category,
      });
      return transaction;
    });
    return Promise.all(promises);
  }
}

export default ImportTransactionsService;
