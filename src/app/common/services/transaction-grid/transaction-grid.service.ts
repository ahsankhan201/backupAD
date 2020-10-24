import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/* Include services here */
import { APISyncService } from '../sync.service';
import { FINANCE_ENDPOINTS, PENDING_TRANSACTION_API_URL } from 'src/app/common/api-endpoints';
/* Include constants and models here */
import {
    TransactionHistoryInterface, TransactionGridModel,
    PendingTransactionModel, PendingTransactionRow,
    TransactionGridRow, GenericTransactionRowModel, PendingTransactionsPayLoad
} from '../../models/global.model';
import { SharedService } from '../../services/shared.service';
import { DOMAINS, TRANSACTION_GRID_TEXT, HYPHEN_TEXT, SLASH, TEXT_TO_SEARCH } from '../../global-constants';

@Injectable({
    providedIn: 'root'
})
export class TransactionGridService {
    typeOfTransactionHistory: string = TRANSACTION_GRID_TEXT.DATE_EFFECTIVE;
    isLoadPendingTransctions = false;
    formattedPendingTransactionList = {} as TransactionGridModel[];
    constructor(private sharedService: SharedService, private httpService: APISyncService) { }

    /**
     * @methodName getTransactionHistory
     * @description used to fetch the transaction history details
     * @parameter url, historyType, otherArgs[loadMoreTransactions, isGhinaAccount, accountNumber]<in this order>
     * @return Observable<any> it's a common function return object wil be different
     */
    getTransactionHistory(url: string, transactionHistoryPayLoad: TransactionHistoryInterface |
        PendingTransactionsPayLoad): Observable<any> {
        if (!transactionHistoryPayLoad[TEXT_TO_SEARCH]) {
            delete transactionHistoryPayLoad[TEXT_TO_SEARCH];
        }
        return this.httpService.get(url + SLASH + transactionHistoryPayLoad.aliasId ,
        undefined, undefined, this.sharedService.removeKeyFromObject('aliasId', transactionHistoryPayLoad));
    }

    /**
     * @methodName generateTransactionGridData
     * @description used to format the transaction history table data year wise and return to the called function
     * @parameter transactionHistoryInfo<any>Accepts different types of data,transactionGridComponentType
     * @return TransactionGridModel
     */
    generateTransactionGridData(transactionHistoryInfo: any, transactionGridComponentType: string): TransactionGridModel[] {
        const formattedTransactionGridArray = [];
        const UNIQUE_YEARS = {};
        if (transactionHistoryInfo) {
            transactionHistoryInfo.map(transactionRow => {
                // transactionRow will get the required properties based on type of transaction
                transactionRow = this.generateTransactionProperties(transactionGridComponentType, transactionRow);
                const TRANSACTION_YEAR = new Date(transactionRow[this.typeOfTransactionHistory]).getFullYear();
                if (!UNIQUE_YEARS[TRANSACTION_YEAR]) {
                    // it'll create the unique year wise transaction history data
                    const formattedTransactionGridObj = {} as TransactionGridModel;
                    UNIQUE_YEARS[TRANSACTION_YEAR] = TRANSACTION_YEAR;
                    formattedTransactionGridObj.year = TRANSACTION_YEAR.toString();
                    formattedTransactionGridObj.transactionHistory = transactionHistoryInfo.filter(history => {
                        return TRANSACTION_YEAR === new Date(history[this.typeOfTransactionHistory]).getFullYear();
                    });
                    formattedTransactionGridArray.push(formattedTransactionGridObj);
                }
            });
        }
        return formattedTransactionGridArray;
    }
    /**
     * @methodName getDatePropertyKey
     * @description used to set the each row of transaction history
     * @parameter transactionComponentType<string>, transactionGridRow<any>Accepts differnt types of objects
     * @return strng
     */
    generateTransactionProperties(transactionComponentType: string, transactionGridRow: any): TransactionGridRow {
        switch (transactionComponentType) {
            // It will generate the Finance transaction table history row object for view when it matches with 'Finance'
            case TRANSACTION_GRID_TEXT.FINANCE_TEXT:
                transactionGridRow = this.generateFinanceTransactionProps(transactionGridRow);
                break;
            // It will generate the Debit Card transaction table history row object for view when it matches with 'Debit'
            case TRANSACTION_GRID_TEXT.DEBIT_TEXT:
                transactionGridRow = this.generateDebitTransactionProps(transactionGridRow);
                break;
            // It will generate the Credit Card transaction table history row object for view when it matches with 'Credit'
            case TRANSACTION_GRID_TEXT.CREDIT_TEXT:
                transactionGridRow = this.generateCreditTransactionProps(transactionGridRow);
                break;
            // It will generate the Credit Card transaction table history row object for view when it matches with 'Pending'
            case TRANSACTION_GRID_TEXT.PENDING_TEXT:
                transactionGridRow = this.generatePendingTransactionProps(transactionGridRow);
                break;
            default: this.typeOfTransactionHistory = TRANSACTION_GRID_TEXT.DATE_EFFECTIVE;
        }
        return transactionGridRow;
    }
    /**
     * @methodName generateDebitTransactionProps
     * @description used to form the finance transaction row properties
     * @parameters financeTransctionRow<GenericTransactionRowModel>
     * @return any It can send the different types of objects based on type of response
     */
    generateFinanceTransactionProps(financeTransctionRow: GenericTransactionRowModel): TransactionGridRow {
        financeTransctionRow.debitOrCreditCode = financeTransctionRow.debitCredit;
        financeTransctionRow.esbReferenceNo = HYPHEN_TEXT;
        financeTransctionRow.currencyCode = financeTransctionRow.currency;
        this.typeOfTransactionHistory = TRANSACTION_GRID_TEXT.DATE_EFFECTIVE;
        return financeTransctionRow;
    }
    /**
     * @methodName generateCreditTransactionProps
     * @description used to form the credit card transaction row properties
     * @parameters creditCardTransctionRow<GenericTransactionRowModel>
     * @return TransactionGridRow
     */
    generateCreditTransactionProps(creditCardTransctionRow: GenericTransactionRowModel): TransactionGridRow {
        creditCardTransctionRow.dateEffective = `${creditCardTransctionRow.transactionDate}T${creditCardTransctionRow.transactionTime}`;
        creditCardTransctionRow.debitOrCreditCode = creditCardTransctionRow.debitCredit;
        creditCardTransctionRow.currencyCode = creditCardTransctionRow.transactionCurrency;
        creditCardTransctionRow.esbReferenceNo = creditCardTransctionRow.transactionReferenceNumber ?
            creditCardTransctionRow.transactionReferenceNumber : HYPHEN_TEXT;
        this.typeOfTransactionHistory = TRANSACTION_GRID_TEXT.TRANSACTION_DATE;
        return creditCardTransctionRow;
    }
    /**
     * @methodName generateFinanceTransactionProps
     * @description used to form the debit card transaction row properties
     * @parameters debitCradTransctionRow<GenericTransactionRowModel>
     * @return TransactionGridRow
     */
    generateDebitTransactionProps(debitCradTransctionRow: GenericTransactionRowModel): TransactionGridRow {
        debitCradTransctionRow.dateEffective = `${debitCradTransctionRow.transactionDate}T${debitCradTransctionRow.transactionTime}`;
        debitCradTransctionRow.debitOrCreditCode = debitCradTransctionRow.debitCredit ? debitCradTransctionRow.debitCredit :
            TRANSACTION_GRID_TEXT.DEBIT_KEY_TEXT;
        debitCradTransctionRow.currencyCode = debitCradTransctionRow.transactionCurrency;
        debitCradTransctionRow.esbReferenceNo = debitCradTransctionRow.transactionReferenceNumber;
        this.typeOfTransactionHistory = TRANSACTION_GRID_TEXT.TRANSACTION_DATE;
        return debitCradTransctionRow;
    }
    /**
     * @methodName generatePendingTransactionProps
     * @description used to form the cover card pending transaction row properties
     * @parameters ccPendingTransctionRow<GenericTransactionRowModel>
     * @return TransactionGridRow
     */
    generatePendingTransactionProps(ccPendingTransctionRow: GenericTransactionRowModel): TransactionGridRow {
        ccPendingTransctionRow.dateEffective = ccPendingTransctionRow.date;
        ccPendingTransctionRow.debitOrCreditCode = ccPendingTransctionRow.debitCredit;
        ccPendingTransctionRow.currencyCode = ccPendingTransctionRow.transactionCurrency;
        ccPendingTransctionRow.esbReferenceNo = ccPendingTransctionRow.transactionReferenceNumber ?
            ccPendingTransctionRow.transactionReferenceNumber : HYPHEN_TEXT;
        this.typeOfTransactionHistory = TRANSACTION_GRID_TEXT.PENDING_TX_DATE;
        ccPendingTransctionRow.description = ccPendingTransctionRow.merchantName ? ccPendingTransctionRow.merchantName : HYPHEN_TEXT;
        return ccPendingTransctionRow;
    }
    /**
     * @methodName updateGridOnScroll
     * @description used to get transaction history object from the response
     * @parameters none
     * @return any It can send the different types of objects based on type of response
     */
    getTransactionHistoryResponseObject(transactionHistoryResponse: any, transactionComponentType: string): any {
        // It will return the transactionHistory object from response based on transaction component type 'Finance/Debit/Credit/Account'
        switch (transactionComponentType) {
            case TRANSACTION_GRID_TEXT.FINANCE_TEXT:
                return transactionHistoryResponse && transactionHistoryResponse.financeHistory ?
                    transactionHistoryResponse.financeHistory : undefined;
            case TRANSACTION_GRID_TEXT.DEBIT_TEXT:
                return transactionHistoryResponse && transactionHistoryResponse.debitCardTransactions ?
                    transactionHistoryResponse.debitCardTransactions : undefined;
            case TRANSACTION_GRID_TEXT.CREDIT_TEXT:
                return transactionHistoryResponse.cardHistory ? transactionHistoryResponse.cardHistory.cardTransaction : undefined;
            case TRANSACTION_GRID_TEXT.ACCOUNT_TEXT:
                return transactionHistoryResponse && transactionHistoryResponse.accountHistory ?
                    transactionHistoryResponse.accountHistory : undefined;
            case TRANSACTION_GRID_TEXT.PENDING_TEXT:
                return transactionHistoryResponse && transactionHistoryResponse.transactionList ?
                    transactionHistoryResponse.transactionList : undefined;
        }
    }

    /**
     * @methodName filterPendingTransactionHistory
     * @description It will return the matched elements from the input array List
     * @parameters none
     * @return PendingTransactionRow<array>
     */
    filterPendingTransactionHistory(pendingTransactionHistoryResponse: PendingTransactionModel, search: string): PendingTransactionRow[] {
        return pendingTransactionHistoryResponse.transactionList.filter(
            transactionRow => transactionRow.transactionAmount.toLowerCase().indexOf(search) > -1);
    }
}
