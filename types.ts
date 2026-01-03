export interface HouseType {
    id: string;
    name: string;
    subtitle: string;
    area: number;
    pyeong: number;
    price: string;
    imageUrl: string;
    features: {
        people: string;
        structure: string;
        bath: string;
        option: string;
    };
    badges?: string[];
}

export interface FAQItem {
    question: string;
    answer: string;
    tags?: string[];
    category: 'general' | 'tech' | 'cost' | 'legal';
}

export interface NavItem {
    label: string;
    icon: string;
    path: string;
}