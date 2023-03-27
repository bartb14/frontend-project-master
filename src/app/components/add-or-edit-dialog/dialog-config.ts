export interface DialogConfig {
    title: string;
    fields: DialogField[];
    acceptCallback: (item: any) => void;
    acceptLabel?: string;
    rejectLabel?: string;
}

export interface DialogField {
    label: string;
    field: string;
    type: 'text' | 'textarea' | 'number' | 'multiselect' | 'calendar';
    step?: number;
    max?: number | string;
    min?: number | string;
    helpText?: string;
    required?: boolean;
    options?: {item_id: number, item_text: string}[];
    multiselectSettings?: {
        singleSelection: boolean;
        selectAllText: string;
        unSelectAllText: string;
        itemsShowLimit?: number;
        limitSelection?: number;
        allowSearchFilter: boolean;
        searchPlaceholderText: string;
        placeholder: string;
        noDataAvailablePlaceholderText: string;
        idField: string;
        textField: string;
    }
}
