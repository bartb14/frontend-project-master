export interface ConfirmationDialogConfig {
    title: string;
    message: string;
    acceptCallback: (item: any) => void;
    rejectLabel?: string;
    acceptLabel?: string;
}