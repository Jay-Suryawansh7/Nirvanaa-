import { Request, Response } from 'express';
import { db } from '../config/drizzle';
import { cases } from '../models/schema';
import { eq, desc } from 'drizzle-orm';
import { calculateReadinessScore, getReadinessStatus } from '../services/scoringService';

export const createCase = async (req: Request, res: Response) => {
    try {
        const { caseIdentifier, title, description, category } = req.body;
        
        await db.insert(cases).values({
            caseNumber: caseIdentifier,
            title,
            description,
            category,
            status: 'WAITING',
            readinessScore: 0,
        });

        res.status(201).json({ message: 'Case created successfully' });
    } catch (error: any) {
        console.error('Error creating case:', error);
        res.status(500).json({ error: error.message || 'Failed to create case' });
    }
};

export const getCases = async (req: Request, res: Response) => {
    try {
        const statusFilter = req.query.status as string;

        let query = db.select().from(cases).orderBy(desc(cases.createdAt));
        
        // Note: Drizzle filtering is better done in the query builder, but for simplicity/enum matching we can fetch and filter or use .where()
        // Since we have an enum, strict type matching is needed. 
        
        const results = await query;

        // Calculate dynamic readiness if needed, or just rely on stored
        // Ideally we update the DB score when things change. 
        // For now, let's compute on read to keep it fresh/same as mock logic
        
        const processed = results.map(c => {
             // Adapt DB "cases" to the shape "Case" interface expects if needed
             // The frontend expects: id, readinessScore, status, lawyerConfirmed, etc.
             // Our DB has these fields.
             return c;
        });

        if (statusFilter && statusFilter !== 'ALL') {
             const filtered = processed.filter(c => c.status === statusFilter);
             return res.json(filtered);
        }

        res.json(processed);
    } catch (error: any) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ error: 'Failed to fetch cases' });
    }
};

export const getCaseMetrics = async (req: Request, res: Response) => {
    try {
        const allCases = await db.select().from(cases);
        
        const totalCases = allCases.length;
        const readyCases = allCases.filter(c => c.status === 'READY').length;
        const highRiskCases = allCases.filter(c => c.status === 'HIGH_RISK').length;
        const mediationReadyCases = allCases.filter(c => c.status === 'MEDIATION_READY').length;

        res.json({
            totalCases,
            readyCases,
            highRiskCases,
            mediationReadyCases,
            partiallyReadyCases: totalCases - readyCases - highRiskCases - mediationReadyCases
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
};
